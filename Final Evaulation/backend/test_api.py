import requests
import os

# Create a dummy image for testing
dummy_image_path = "dummy_test_image.jpg"
import numpy as np
import cv2
# Create a blank green image (just so OpenCV doesn't fail decoding)
img = np.zeros((500, 500, 3), dtype=np.uint8)
img[:] = (0, 255, 0)
cv2.imwrite(dummy_image_path, img)

url = "http://127.0.0.1:8000/api/predict/"

# Prepare the multipart form data
with open(dummy_image_path, "rb") as image_file:
    files = {"image": image_file}
    data = {
        "age_days": 2,
        "gestational_age": 39
    }
    
    print("Sending POST request to", url, "...")
    try:
        response = requests.post(url, files=files, data=data)
        print("Status Code:", response.status_code)
        print("Response JSON:")
        import json
        print(json.dumps(response.json(), indent=4))
    except requests.exceptions.ConnectionError:
        print("Connection Error: Make sure your Django server is running using 'python manage.py runserver'")

# Clean up
if os.path.exists(dummy_image_path):
    os.remove(dummy_image_path)
