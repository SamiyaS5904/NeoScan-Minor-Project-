import os
import joblib
import pandas as pd
from django.conf import settings

# --- MODEL LOADING (Singleton pattern to save memory) ---
# We will define the paths to your models here. 
# You will need to move your .pkl files into the 'ml_models' folder.
MODEL_DIR = os.path.join(settings.BASE_DIR.parent, 'ml_models')
model_path = os.path.join(MODEL_DIR, 'neoscan_xgboost.pkl')
scaler_path = os.path.join(MODEL_DIR, 'neoscan_scaler.pkl')

xgboost_model = None
scaler = None

def load_models():
    """Loads models if they exist. Called only once or lazily."""
    global xgboost_model, scaler
    try:
        if xgboost_model is None and os.path.exists(model_path):
            xgboost_model = joblib.load(model_path)
        if scaler is None and os.path.exists(scaler_path):
            scaler = joblib.load(scaler_path)
    except Exception as e:
        print(f"Error loading models: {e}")

# Call load on start
load_models()

# --- PREPROCESSING & PREDICTION ---
def preprocess_and_predict(r, g, b, s, lab_l, lab_a, lab_b, age_days, gestational_age):
    # Ensure models are loaded
    if xgboost_model is None or scaler is None:
        raise Exception("Models are not loaded. Please ensure .pkl files are in the ml_models directory.")

    # 1. Feature Engineering (As per your details)
    r_minus_b = r - b
    lab_ratio = lab_a / lab_b if lab_b != 0 else 0
    age_labb = age_days * lab_b
    
    # 2. Build DataFrame (matching your training feature names)
    features = pd.DataFrame([{
        'R': r, 'G': g, 'B': b, 'S': s,
        'LAB_L': lab_l, 'LAB_A': lab_a, 'LAB_B': lab_b,
        'age_days': age_days,
        'gestational_age': gestational_age,
        'R_minus_B': r_minus_b,
        'LAB_ratio': lab_ratio,
        'Age_LABB': age_labb
    }])
    
    # 3. Scale Features
    features_scaled = scaler.transform(features)
    
    # 4. Predict
    prediction = xgboost_model.predict(features_scaled)[0]
    return float(prediction)

# --- CLINICAL LOGIC ---
def get_clinical_risk(bilirubin, age_days):
    """Simplified Bhutani-inspired age-based logic"""
    if age_days <= 1:
        if bilirubin < 5: return "Low Risk"
        if bilirubin < 8: return "Intermediate Risk"
        return "High Risk"
    elif age_days <= 2:
        if bilirubin < 8: return "Low Risk"
        if bilirubin < 12: return "Intermediate Risk"
        return "High Risk"
    else:
        if bilirubin < 12: return "Low Risk"
        if bilirubin < 15: return "Intermediate Risk"
        return "High Risk"

def get_recommendation(risk_zone):
    if risk_zone == "Low Risk":
        return "Routine clinical care and feeding."
    elif risk_zone == "Intermediate Risk":
        return "Monitor closely. Consider repeat testing in 12-24 hours."
    else:
        return "Immediate medical evaluation for potential phototherapy."

# --- IMAGE PROCESSING ---
import cv2
import numpy as np
import base64

def calibrate_using_gray_patch(img):
    h, w, _ = img.shape
    # Approximate gray patch (top-left corner)
    patch = img[int(h*0.05):int(h*0.15), int(w*0.05):int(w*0.15)]
    
    avg_b = np.mean(patch[:,:,0])
    avg_g = np.mean(patch[:,:,1])
    avg_r = np.mean(patch[:,:,2])
    
    # Avoid division by zero
    if avg_b == 0 or avg_g == 0 or avg_r == 0:
        return img
        
    avg_gray = (avg_b + avg_g + avg_r) / 3
    
    img = img.astype(np.float32)
    img[:,:,0] *= (avg_gray / avg_b)
    img[:,:,1] *= (avg_gray / avg_g)
    img[:,:,2] *= (avg_gray / avg_r)
    
    return np.clip(img, 0, 255).astype(np.uint8)

def calculate_calibration_profile(image_bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        raise ValueError("Invalid calibration image.")
        
    h, w, _ = img.shape
    patch = img[int(h*0.25):int(h*0.75), int(w*0.25):int(w*0.75)]
    
    avg_b = np.mean(patch[:,:,0])
    avg_g = np.mean(patch[:,:,1])
    avg_r = np.mean(patch[:,:,2])
    
    if avg_b == 0 or avg_g == 0 or avg_r == 0:
        raise ValueError("Image is too dark to calibrate.")
        
    avg_gray = (avg_b + avg_g + avg_r) / 3
    
    profile = {
        'b_ratio': float(avg_gray / avg_b),
        'g_ratio': float(avg_gray / avg_g),
        'r_ratio': float(avg_gray / avg_r)
    }
    return profile

def get_skin_patch(img):
    h, w, _ = img.shape
    y1, y2 = int(h*0.35), int(h*0.65)
    x1, x2 = int(w*0.35), int(w*0.65)
    return img[y1:y2, x1:x2], (x1, y1, x2, y2)

def extract_features_from_image(image_bytes, calibration_profile=None):
    """
    OpenCV image processing pipeline adapted for backend API.
    Extracts features from the image bytes and returns them.
    """
    # 1. Convert image bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        raise ValueError("Invalid image provided. OpenCV could not decode the image.")
        
    # STEP 1: calibration
    if calibration_profile:
        # FAKE CALIBRATION: As requested, we visually show calibration in the UI
        # but do NOT actually alter the pixels. This ensures we don't corrupt the images
        # and break the XGBoost model which was trained on raw dataset images.
        calibrated = img.copy()
    else:
        # Fallback to raw image to prevent color corruption on dataset images
        calibrated = img.copy()
    
    # STEP 2: ROI
    roi, (x1, y1, x2, y2) = get_skin_patch(calibrated)
    
    # STEP 3: improved mask
    hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
    # Widen the mask to include jaundice (yellow) hue which goes up to 35-40 in OpenCV
    # Hue 0-45 covers red through strong yellow.
    lower = np.array([0, 10, 30])
    upper = np.array([45, 255, 255])
    mask = cv2.inRange(hsv, lower, upper)
    
    # clean noise
    kernel = np.ones((5,5), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    
    pixels = roi[mask > 0]
    
    # If the skin patch was very uniform, but slightly out of range, fallback to full ROI
    if len(pixels) < 50:
        pixels = roi.reshape(-1, 3)
        mask.fill(255) # Pretend everything is skin to prevent crashes on solid dataset patches
        
    # -------------------------
    # FEATURE EXTRACTION
    # -------------------------
    hsv_pixels = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)[mask > 0]
    lab_pixels = cv2.cvtColor(roi, cv2.COLOR_BGR2LAB)[mask > 0]
    
    mean_rgb = np.mean(pixels, axis=0)
    mean_hsv = np.mean(hsv_pixels, axis=0)
    mean_lab = np.mean(lab_pixels, axis=0)
    
    # Create overlay image
    overlay = roi.copy()
    overlay[mask == 0] = [0, 0, 0] # Mask out non-skin

    _, buffer_roi = cv2.imencode('.jpg', roi)
    _, buffer_overlay = cv2.imencode('.jpg', overlay)

    roi_b64 = base64.b64encode(buffer_roi).decode('utf-8')
    overlay_b64 = base64.b64encode(buffer_overlay).decode('utf-8')
    
    # Return features as expected by the ML model
    return {
        'R': float(mean_rgb[2]),
        'G': float(mean_rgb[1]),
        'B': float(mean_rgb[0]),
        'S': float(mean_hsv[1]), # Saturation channel
        'LAB_L': float(mean_lab[0]),
        'LAB_A': float(mean_lab[1]),
        'LAB_B': float(mean_lab[2]),
        'roi_image': roi_b64,
        'roi_overlay': overlay_b64
    }

