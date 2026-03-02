import requests
import json

try:
    with open("eye_image.jpg", "rb") as f:
        img_data = f.read()
except FileNotFoundError:
    print("No eye_image.jpg found for testing.")
    exit()

import base64
b64 = "data:image/jpeg;base64," + base64.b64encode(img_data).decode('utf-8')

res = requests.post("http://localhost:5000/api/analyze", json={"image": b64})
print(res.status_code)
print(json.dumps(res.json(), indent=2))
