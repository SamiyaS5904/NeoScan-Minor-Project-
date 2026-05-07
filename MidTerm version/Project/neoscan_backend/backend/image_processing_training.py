import cv2
import numpy as np

# -------------------------------
# Load & Preprocess
# -------------------------------

def load_image(path):
    img = cv2.imread(path)
    if img is None:
        raise ValueError(f"Image not found at {path}")
    return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)


def preprocess(image):
    max_size = 512
    h, w = image.shape[:2]

    if max(h, w) > max_size:
        scale = max_size / max(h, w)
        image = cv2.resize(image, (int(w*scale), int(h*scale)))

    return cv2.GaussianBlur(image, (5,5), 0)

# -------------------------------
# SKIN REGION DETECTION 🔥
# -------------------------------

def segment_skin(image):
    ycrcb = cv2.cvtColor(image, cv2.COLOR_RGB2YCrCb)

    lower = np.array([0,133,77], dtype=np.uint8)
    upper = np.array([255,173,127], dtype=np.uint8)

    mask = cv2.inRange(ycrcb, lower, upper)

    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5,5))
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if not contours:
        return image, image, mask

    largest = max(contours, key=cv2.contourArea)

    final_mask = np.zeros_like(mask)
    cv2.drawContours(final_mask, [largest], -1, 255, -1)

    skin_only = cv2.bitwise_and(image, image, mask=final_mask)

    x, y, w, h = cv2.boundingRect(largest)
    cropped = image[y:y+h, x:x+w]

    # Debug image (for professors 💯)
    debug = image.copy()
    cv2.rectangle(debug, (x,y), (x+w,y+h), (0,255,0), 2)
    cv2.putText(debug, "Skin Region Used", (10,30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,255,0), 2)

    return cropped, debug, final_mask

# -------------------------------
# FEATURE EXTRACTION
# -------------------------------

def extract_features(image):
    pixels = image[np.any(image > 0, axis=2)]

    if len(pixels) == 0:
        return None

    R = pixels[:,0]
    G = pixels[:,1]
    B = pixels[:,2]

    features = {
        "mean_R": np.mean(R),
        "mean_G": np.mean(G),
        "mean_B": np.mean(B),
        "std_R": np.std(R),
        "std_G": np.std(G),
        "std_B": np.std(B),
        "R_B_ratio": np.mean(R)/(np.mean(B)+1e-6),
        "yellow_index": np.mean(R)-np.mean(B),
    }

    return features

# -------------------------------
# MAIN PIPELINE (TRAINING)
# -------------------------------

def process_image(image_path):
    img = preprocess(load_image(image_path))

    skin_crop, debug_img, mask = segment_skin(img)

    features = extract_features(skin_crop)

    # Save debug output
    cv2.imwrite("debug_region.jpg", cv2.cvtColor(debug_img, cv2.COLOR_RGB2BGR))
    cv2.imwrite("mask.jpg", mask)

    return features

    