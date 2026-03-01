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
    return cv2.GaussianBlur(image, (5, 5), 0)


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
