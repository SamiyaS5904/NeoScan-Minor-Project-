"""
NeoScan Dual-Image Feature Extraction Pipeline
------------------------------------------------
This module extracts medically-safe color features from:
1) Skin image (body region)
2) Eye image (sclera region)

It performs:
- ROI extraction
- Mild denoising
- Multi-color space feature extraction (RGB, HSV, YCrCb)
- Automatic dark-skin detection logic
- Adaptive feature weighting (skin vs eye)

This file does NOT perform bilirubin prediction yet.
It prepares clean feature vectors for ML training.
"""

import cv2
import numpy as np


# -------------------------------------------------
# Utility Functions
# -------------------------------------------------

def load_image(path):
    img = cv2.imread(path)
    if img is None:
        raise ValueError(f"Image not found at {path}")
    return img


def preprocess_image(image):
    """Apply mild Gaussian smoothing"""
    return cv2.GaussianBlur(image, (5, 5), 0)


def extract_center_roi(image, ratio=0.4):
    """Extract central ROI to reduce background noise"""
    h, w, _ = image.shape
    h1 = int(h * (0.5 - ratio / 2))
    h2 = int(h * (0.5 + ratio / 2))
    w1 = int(w * (0.5 - ratio / 2))
    w2 = int(w * (0.5 + ratio / 2))
    return image[h1:h2, w1:w2]


# -------------------------------------------------
# Feature Extraction Core
# -------------------------------------------------

def extract_color_features(image):
    """
    Extract multi-color space features.
    Returns a dictionary of interpretable features.
    """

    roi = extract_center_roi(image)

    # ----- RGB -----
    rgb = cv2.cvtColor(roi, cv2.COLOR_BGR2RGB)
    mean_rgb = np.mean(rgb, axis=(0, 1))
    std_rgb = np.std(rgb, axis=(0, 1))

    R, G, B = mean_rgb
    rb_ratio = R / (B + 1e-6)
    rg_ratio = R / (G + 1e-6)
    yellow_index = R - B

    # ----- HSV -----
    hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
    mean_hsv = np.mean(hsv, axis=(0, 1))
    H, S, V = mean_hsv

    # ----- YCrCb -----
    ycrcb = cv2.cvtColor(roi, cv2.COLOR_BGR2YCrCb)
    mean_ycrcb = np.mean(ycrcb, axis=(0, 1))
    Y, Cr, Cb = mean_ycrcb

    features = {
        "Mean_R": R,
        "Mean_G": G,
        "Mean_B": B,
        "Std_R": std_rgb[0],
        "Std_G": std_rgb[1],
        "Std_B": std_rgb[2],
        "RB_Ratio": rb_ratio,
        "RG_Ratio": rg_ratio,
        "Yellow_Index": yellow_index,
        "Hue": H,
        "Saturation": S,
        "Value": V,
        "Luminance_Y": Y,
        "Cr": Cr,
        "Cb": Cb
    }

    return features


# -------------------------------------------------
# Dark Skin Detection Logic
# -------------------------------------------------

def is_skin_dark(feature_dict, luminance_threshold=120):
    """
    Determine if skin luminance is low (dark skin / low light).
    """
    return feature_dict["Luminance_Y"] < luminance_threshold


# -------------------------------------------------
# Combined Dual Image Feature Builder
# -------------------------------------------------

def build_combined_features(skin_image_path, eye_image_path):

    skin_img = preprocess_image(load_image(skin_image_path))
    eye_img = preprocess_image(load_image(eye_image_path))

    skin_features = extract_color_features(skin_img)
    eye_features = extract_color_features(eye_img)

    dark_skin_flag = is_skin_dark(skin_features)

    # Adaptive weighting
    if dark_skin_flag:
        skin_weight = 0.4
        eye_weight = 0.6
    else:
        skin_weight = 0.6
        eye_weight = 0.4

    combined_features = {}

    for key in skin_features.keys():
        combined_features[key + "_Combined"] = (
            skin_weight * skin_features[key] +
            eye_weight * eye_features[key]
        )

    return {
        "Skin_Features": skin_features,
        "Eye_Features": eye_features,
        "Combined_Features": combined_features,
        "Dark_Skin_Detected": dark_skin_flag
    }


# -------------------------------------------------
# Main Execution (Demo)
# -------------------------------------------------

if __name__ == "__main__":

    skin_path = "skin_image.jpg"
    eye_path = "eye_image.jpg"

    results = build_combined_features(skin_path, eye_path)

    print("\nDark Skin Detected:", results["Dark_Skin_Detected"])

    print("\n--- Combined Features (Used for ML) ---")
    for k, v in results["Combined_Features"].items():
        print(f"{k}: {v:.4f}")

    print("\nFeature Vector Length:", len(results["Combined_Features"]))
