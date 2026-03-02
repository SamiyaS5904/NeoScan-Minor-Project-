from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(_name_)
CORS(app)

# Dummy in-memory storage
users = []

@app.route("/api/health")
def health():
    return {"status": "Backend running"}

@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    users.append(data)
    return jsonify({
        "token": "demo-token",
        "user": data
    })

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    for user in users:
        if user["email"] == data["email"] and user["password"] == data["password"]:
            return jsonify({
                "token": "demo-token",
                "user": user
            })
    return jsonify({"message": "Invalid credentials"}), 401

@app.route("/api/dashboard")
def dashboard():
    return jsonify({
        "babyName": "Demo Baby",
        "bilirubin": 8.4,
        "risk": "Low",
        "history": [
            {"date": "2024-03-01", "value": 7.2},
            {"date": "2024-03-02", "value": 8.4}
        ]
    })


@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    return jsonify({
        "token": "demo-token",
        "user": data
    })

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    return jsonify({
        "token": "demo-token",
        "user": data
    })
    
if __name__ == "__main__":
    app.run(debug=True, port=5000)