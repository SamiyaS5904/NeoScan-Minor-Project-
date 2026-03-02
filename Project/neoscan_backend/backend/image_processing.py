"""
NeoScan – Final Eye-Based Calibrated Image Processing Pipeline
-----------------------------------------------------------------
Flow:
1. User logs in (handled in frontend, assumed complete)
2. User captures WHITE reference image (same lighting)
3. User captures EYE (sclera) image
4. System performs white calibration
5. Extracts multi–color space features
6. Outputs ML-ready feature vector

This file focuses ONLY on image processing + feature generation.
No ML training is done here.
"""

import cv2
import numpy as np

# -----------------------------------------------------
# Utility Functions
# -----------------------------------------------------

def load_image(path):
    img = cv2.imread(path)
    if img is None:
        raise ValueError(f"Image not found at {path}")
    return img


def preprocess(image):
    # Resize image to manageable size
    max_size = 512

    height, width = image.shape[:2]

    if max(height, width) > max_size:
        scale = max_size / max(height, width)
        new_width = int(width * scale)
        new_height = int(height * scale)
        image = cv2.resize(image, (new_width, new_height))

    # Apply blur after resizing
    image = cv2.GaussianBlur(image, (5, 5), 0)

    return image


# -----------------------------------------------------
# White Calibration
# -----------------------------------------------------

def compute_white_reference(white_img):
    """
    Compute mean RGB of white reference image.
    """
    rgb = cv2.cvtColor(white_img, cv2.COLOR_BGR2RGB)
    mean_rgb = np.mean(rgb, axis=(0, 1))
    return mean_rgb


def apply_white_balance(image, white_mean_rgb):
    """
    Normalize image using white reference.
    Prevents lighting bias.
    """
    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB).astype(np.float32)

    # Avoid division by zero
    white_mean_rgb = np.where(white_mean_rgb == 0, 1, white_mean_rgb)

    normalized = rgb / white_mean_rgb

    # Scale back to 0–255
    normalized = normalized / np.max(normalized)
    normalized = (normalized * 255).clip(0, 255)

    return normalized.astype(np.uint8)


# -----------------------------------------------------
# Feature Extraction
# -----------------------------------------------------

def extract_features(image):
    """
    Extract multi-color space features from calibrated sclera image.
    """

    # RGB
    mean_rgb = np.mean(image, axis=(0, 1))
    std_rgb = np.std(image, axis=(0, 1))
    R, G, B = mean_rgb

    rb_ratio = R / (B + 1e-6)
    rg_ratio = R / (G + 1e-6)
    yellow_index = R - B

    # HSV
    hsv = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)
    mean_hsv = np.mean(hsv, axis=(0, 1))
    H, S, V = mean_hsv

    # YCrCb
    ycrcb = cv2.cvtColor(image, cv2.COLOR_RGB2YCrCb)
    mean_ycrcb = np.mean(ycrcb, axis=(0, 1))
    Y, Cr, Cb = mean_ycrcb

    features = {
        "Mean_R": R,
        "Mean_G": G,
        "Mean_B": B,
        "Std_R": std_rgb[0],
        "Std_G": std_rgb[1],
        "Std_B": std_rgb[2],
        "R/B_Ratio": rb_ratio,
        "R/G_Ratio": rg_ratio,
        "Yellow_Index": yellow_index,
        "Hue": H,
        "Saturation": S,
        "Value": V,
        "Luminance_Y": Y,
        "Cr": Cr,
        "Cb": Cb
    }

    return features

# -----------------------------------------------------
# Sclera Segmentation
# -----------------------------------------------------

def segment_sclera(image):
    """
    Isolates the sclera (white of the eye) by masking out typical skin tones
    and finding the largest remaining bright contour.
    Returns the cropped sclera image.
    """
    # Image is calibrated_eye, which is RGB.
    # Convert to YCrCb space for robust skin detection
    ycrcb = cv2.cvtColor(image, cv2.COLOR_RGB2YCrCb)
    
    # Typical skin color bounds in YCrCb
    # Lower bound focuses on keeping Y (luma) flexible but restricting Cr/Cb to skin tones
    lower_skin = np.array([0, 133, 77], dtype=np.uint8)
    upper_skin = np.array([255, 173, 127], dtype=np.uint8)
    
    # Create mask for skin
    skin_mask = cv2.inRange(ycrcb, lower_skin, upper_skin)
    
    # Invert the mask: we want non-skin (the eye/sclera)
    non_skin_mask = cv2.bitwise_not(skin_mask)
    
    # Additionally, the sclera is generally the brightest part of the eye
    # Convert to grayscale and threshold to find bright regions
    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    _, bright_mask = cv2.threshold(gray, 180, 255, cv2.THRESH_BINARY)
    
    # Combine the non-skin mask and the bright mask
    combined_mask = cv2.bitwise_and(non_skin_mask, bright_mask)
    
    # Clean up the mask using morphological operations
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    cleaned_mask = cv2.morphologyEx(combined_mask, cv2.MORPH_OPEN, kernel)
    cleaned_mask = cv2.morphologyEx(cleaned_mask, cv2.MORPH_CLOSE, kernel)
    
    # Find contours
    contours, _ = cv2.findContours(cleaned_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if not contours:
        # Fallback if no sclera is found, return original image
        return image
        
    # Assume the largest contour is the sclera
    largest_contour = max(contours, key=cv2.contourArea)
    
    # Get bounding box
    x, y, w, h = cv2.boundingRect(largest_contour)
    
    # Add a little padding if possible
    padding = 5
    x_start = max(0, x - padding)
    y_start = max(0, y - padding)
    x_end = min(image.shape[1], x + w + padding)
    y_end = min(image.shape[0], y + h + padding)
    
    cropped_sclera = image[y_start:y_end, x_start:x_end]
    
    # Save the output for the professors
    # imwrite expects BGR format, but cropped_sclera is RGB, so swap channels before saving
    cv2.imwrite("sclera_debug.jpg", cv2.cvtColor(cropped_sclera, cv2.COLOR_RGB2BGR))
    
    return cropped_sclera

# -----------------------------------------------------
# Flask Callable Pipeline Function
# -----------------------------------------------------

def process_pipeline(white_img, eye_img):
    """
    Full calibration + feature extraction pipeline
    For Flask usage.
    """

    white_img = preprocess(white_img)
    eye_img = preprocess(eye_img)

    white_mean_rgb = compute_white_reference(white_img)

    calibrated_eye = apply_white_balance(eye_img, white_mean_rgb)
    
    # SEGMENT THE SCLERA
    isolated_sclera = segment_sclera(calibrated_eye)

    features = extract_features(isolated_sclera)

    # Convert dictionary to ML-ready feature vector
    feature_vector = np.array(list(features.values())).reshape(1, -1)

    return {
        "features": features,
        "feature_vector": feature_vector.tolist()
    }

# -----------------------------------------------------
# Main Pipeline
# -----------------------------------------------------

if __name__ == "__main__":

    print("\n--- NeoScan Eye Calibration Pipeline ---")

    # Step 1: Load images
    white_path = "white_reference.jpg"
    eye_path = "eye_image.jpg"

    white_img = preprocess(load_image(white_path))
    eye_img = preprocess(load_image(eye_path))

    # Step 2: Compute white reference
    white_mean_rgb = compute_white_reference(white_img)

    print("\nWhite Reference Mean RGB:", white_mean_rgb)

    # Step 3: Apply calibration
    calibrated_eye = apply_white_balance(eye_img, white_mean_rgb)

    # Step 4: Extract features
    features = extract_features(calibrated_eye)

    print("\n=== Calibrated Eye Features ===")
    for k, v in features.items():
        print(f"{k}: {v:.4f}")

    # ML-ready feature vector
    feature_vector = np.array(list(features.values())).reshape(1, -1)

    print("\nML Input Feature Vector Shape:", feature_vector.shape)
    print("Feature Vector:")
    print(feature_vector)

    print("\nPipeline Complete. Ready for ML Model Integration.")
