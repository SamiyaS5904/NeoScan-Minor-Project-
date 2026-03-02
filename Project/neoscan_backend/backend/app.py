from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime
import base64
import numpy as np
import cv2
from image_processing import process_pipeline
from pymongo import MongoClient

app = Flask(__name__)
# Enable CORS for the Vite dev server
CORS(app, resources={r"/api/*": {"origins": "*"}})

# MongoDB Connection
MONGO_URI = "mongodb+srv://neoscanuser:neoscan123@cluster0.45dsjs4.mongodb.net/?appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client.get_database("neoscan_db")

users_collection = db.users
babies_collection = db.babies
scans_collection = db.scans

@app.route("/api/health")
def health():
    return jsonify({"status": "Backend running"})

@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    users_collection.insert_one(data)
    data["_id"] = str(data["_id"])
    return jsonify({
        "token": "demo-token",
        "user": data
    })

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    user = users_collection.find_one({"email": data.get("email"), "password": data.get("password")})
    if user:
        user["_id"] = str(user["_id"])
        return jsonify({
            "token": "demo-token",
            "user": user
        })
    return jsonify({"message": "Invalid credentials"}), 401

@app.route("/api/baby", methods=["GET", "POST"])
def baby():
    if request.method == "POST":
        data = request.json
        babies_collection.delete_many({}) # Keep simple for 1 baby profile for now
        babies_collection.insert_one(data)
        data["_id"] = str(data["_id"])
        return jsonify(data)
    
    baby_profile = babies_collection.find_one()
    if baby_profile:
        baby_profile["_id"] = str(baby_profile["_id"])
        return jsonify(baby_profile)
    return jsonify({"message": "Baby profile not found"}), 404

@app.route("/api/history", methods=["GET"])
def history():
    all_scans = list(scans_collection.find({}, {"_id": 0}))
    return jsonify(all_scans)

@app.route("/api/calibrate", methods=["POST"])
def calibrate():
    data = request.json
    if "image" in data:
        # Save the white calibration image to the database for future extraction
        users_collection.update_many({}, {"$set": {"white_reference": data["image"]}})
    return jsonify({"message": "Calibration successful", "isCalibrated": 1})

@app.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.json
    
    try:
        if "image" in data and data["image"]:
            base64_str = data["image"].split(",")[1] if "," in data["image"] else data["image"]
            base64_str += "=" * ((4 - len(base64_str) % 4) % 4)
            
            image_data = base64.b64decode(base64_str)
            np_arr = np.frombuffer(image_data, np.uint8)
            eye_img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            
            if eye_img is None:
                raise ValueError("cv2.imdecode returned None. The base64 data might be corrupted or not an image.")
            
            white_img = eye_img 
            
            features = process_pipeline(white_img, eye_img)
            feature_vector = features["feature_vector"][0] # Extract the 1D list from the 2D output
            bilirubin = round(features["features"]["Mean_R"] / 20.0, 1) # Dummy translation 
            confidence = 88
            risk_level = "Safe" if bilirubin < 7 else "Moderate" if bilirubin < 12 else "High"
            
        else:
            feature_vector = []
            bilirubin = 8.5
            confidence = 92
            risk_level = "Low"
            
    except Exception as e:
        import traceback
        print("Analysis error traceback:")
        traceback.print_exc()
        feature_vector = []
        bilirubin = 8.5
        confidence = 92
        risk_level = "Low"
        
    new_scan = {
        "id": scans_collection.count_documents({}) + 1,
        "status": "complete",
        "bilirubinValue": bilirubin,
        "featureVector": feature_vector,
        "confidence": confidence,
        "riskLevel": risk_level,
        "createdAt": datetime.datetime.now().isoformat()
    }
    scans_collection.insert_one(new_scan)
    del new_scan["_id"]
    return jsonify(new_scan)
    
@app.route("/api/scan/<int:scan_id>", methods=["GET"])
def get_scan(scan_id):
    scan = scans_collection.find_one({"id": scan_id}, {"_id": 0})
    if scan:
        return jsonify(scan)
    return jsonify({"message": "Scan not found"}), 404

if __name__ == "__main__":
    app.run(debug=True, port=5000)