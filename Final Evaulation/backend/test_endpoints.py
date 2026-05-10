import requests
import json
import os
import cv2
import numpy as np

# 1. Setup Data
username = 'testuser'
password = 'testpassword123'
base_url = 'http://127.0.0.1:8000'

session = requests.Session()

# Create dummy image
img_path = 'dummy.jpg'
img = np.zeros((100, 100, 3), dtype=np.uint8)
cv2.imwrite(img_path, img)

def print_res(res, name):
    print(f"--- {name} ---")
    print(f"Status: {res.status_code}")
    try:
        print(res.json())
    except:
        print(res.text[:200])
    print()

# 2. Get CSRF Token
res = session.get(base_url + '/')
csrf_token = session.cookies.get('csrftoken')
if not csrf_token:
    print("Warning: no csrf_token obtained from GET /")

# Register
reg_data = {
    'username': username,
    'password': password,
    'email': 'test@test.com',
    'role': 'patient',
    'csrfmiddlewaretoken': csrf_token
}
res = session.post(base_url + '/register/', data=reg_data, headers={'Referer': base_url + '/register/'})
print_res(res, "Register")

# Login
login_data = {
    'username': username,
    'password': password,
    'csrfmiddlewaretoken': session.cookies.get('csrftoken')
}
res = session.post(base_url + '/login/', data=login_data, headers={'Referer': base_url + '/login/'})
print_res(res, "Login")

csrf_token = session.cookies.get('csrftoken')
headers = {'X-CSRFToken': csrf_token, 'Referer': base_url + '/'}

# Test Predict
with open(img_path, 'rb') as f:
    res = session.post(base_url + '/api/predict/', files={'image': f}, data={'age_days': 2}, headers=headers)
    print_res(res, "Predict Endpoint")

# Test Calibrate
with open(img_path, 'rb') as f:
    res = session.post(base_url + '/api/calibrate/', files={'image': f}, headers=headers)
    print_res(res, "Calibrate Endpoint")

# Test Chat
res = session.post(base_url + '/api/chat/', json={'message': 'hello'}, headers=headers)
print_res(res, "Chat Endpoint")

# Test Get Settings
res = session.get(base_url + '/api/get_patient_settings/', headers=headers)
print_res(res, "Get Patient Settings")

# Test Update Settings
res = session.post(base_url + '/api/update_patient_settings/', json={'scan_interval_hours': 12}, headers=headers)
print_res(res, "Update Patient Settings")

if os.path.exists(img_path):
    os.remove(img_path)
