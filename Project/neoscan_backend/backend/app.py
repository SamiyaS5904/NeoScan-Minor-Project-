from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from image_processing import process_pipeline  

app = Flask(__name__)
CORS(app)


@app.route("/api/health", methods=["GET"])
def health():
    return {"status": "Backend running"}

@app.route("/api/analyze", methods=["POST"])
def analyze():

    white_file = request.files["white_image"]
    eye_file = request.files["eye_image"]

    white_img = cv2.imdecode(
        np.frombuffer(white_file.read(), np.uint8),
        cv2.IMREAD_COLOR
    )

    eye_img = cv2.imdecode(
        np.frombuffer(eye_file.read(), np.uint8),
        cv2.IMREAD_COLOR
    )

    result = process_pipeline(white_img, eye_img)

    return jsonify(result)
if __name__ == "__main__":
    app.run(debug=True, port=5000)