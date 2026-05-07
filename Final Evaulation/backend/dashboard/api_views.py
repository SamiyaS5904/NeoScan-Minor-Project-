from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .ml_pipeline import preprocess_and_predict, get_clinical_risk, get_recommendation, extract_features_from_image
from .mongo_client import get_predictions_collection
import traceback
from datetime import datetime

# Secure API: Only logged-in users can predict
@api_view(['POST'])
@permission_classes([IsAuthenticated]) 
def predict_bilirubin(request):
    try:
        # Check if an image was uploaded
        if 'image' not in request.FILES:
            return Response({"status": "error", "message": "No image provided"}, status=400)
            
        image_file = request.FILES['image']
        image_bytes = image_file.read()
        
        # 1. OpenCV Preprocessing & Feature Extraction
        extracted_features = extract_features_from_image(image_bytes)
        
        r = extracted_features.get('R', 0)
        g = extracted_features.get('G', 0)
        b = extracted_features.get('B', 0)
        s = extracted_features.get('S', 0)
        lab_l = extracted_features.get('LAB_L', 0)
        lab_a = extracted_features.get('LAB_A', 0)
        lab_b = extracted_features.get('LAB_B', 0)
        
        # Metadata from the request body
        data = request.data
        age_days = float(data.get('age_days', 0))
        gestational_age = float(data.get('gestational_age', 38))
        
        # 2. Predict
        predicted_bilirubin = preprocess_and_predict(
            r, g, b, s, lab_l, lab_a, lab_b, age_days, gestational_age
        )
        
        # 3. Clinical Logic
        risk_zone = get_clinical_risk(predicted_bilirubin, age_days)
        recommendation = get_recommendation(risk_zone)
        
        # 4. Save to MongoDB Atlas
        prediction_record = {
            "features": {
                "R": r, "G": g, "B": b, "S": s,
                "LAB_L": lab_l, "LAB_A": lab_a, "LAB_B": lab_b,
                "age_days": age_days, "gestational_age": gestational_age
            },
            "results": {
                "predicted_bilirubin": round(predicted_bilirubin, 2),
                "risk_zone": risk_zone,
                "recommendation": recommendation
            },
            "timestamp": datetime.utcnow()
        }
        
        # Add the username to the record if the user is authenticated
        if request.user and request.user.is_authenticated:
            prediction_record["user_id"] = request.user.id
            prediction_record["username"] = request.user.username
            
        try:
            predictions_collection = get_predictions_collection()
            if predictions_collection is not None:
                inserted = predictions_collection.insert_one(prediction_record)
                prediction_record["_id"] = str(inserted.inserted_id) # Convert ObjectId to string for JSON response
        except Exception as mongo_e:
            print(f"Failed to save to MongoDB: {mongo_e}")
            # Decide if you want to fail the request or just proceed without saving. We proceed here.

        # 5. Return JSON response
        return Response({
            "status": "success",
            "predicted_bilirubin": round(predicted_bilirubin, 2),
            "risk_zone": risk_zone,
            "recommendation": recommendation,
            "saved_to_db": "_id" in prediction_record
        })
        
    except Exception as e:
        return Response({
            "status": "error", 
            "message": str(e),
            "traceback": traceback.format_exc()
        }, status=400)

from .chatbot import generate_chat_response

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_with_neobot(request):
    try:
        user_message = request.data.get('message')
        history = request.data.get('history', [])
        
        if not user_message:
            return Response({"status": "error", "message": "No message provided"}, status=400)
            
        bot_reply = generate_chat_response(user_message, history)
        
        return Response({
            "status": "success",
            "reply": bot_reply
        })
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
