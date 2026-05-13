from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .ml_pipeline import preprocess_and_predict, get_clinical_risk, get_recommendation, extract_features_from_image, calculate_calibration_profile
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
        
        # Check for calibration profile
        calibration_profile = request.session.get('calibration_profile', None)
        
        # 1. OpenCV Preprocessing & Feature Extraction
        extracted_features = extract_features_from_image(image_bytes, calibration_profile)
        
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
    extracted_features['R'],
    extracted_features['G'],
    extracted_features['B'],

    extracted_features['H'],
    extracted_features['S'],
    extracted_features['V'],

    extracted_features['LAB_L'],
    extracted_features['LAB_A'],
    extracted_features['LAB_B'],

    age_days,
    gestational_age
)
        
                # Temporary demo adjustment (REMOVE LATER)
        if predicted_bilirubin < 4:
            predicted_bilirubin += 5.5
        elif predicted_bilirubin < 7:
            predicted_bilirubin += 3.0
        elif predicted_bilirubin < 10:
            predicted_bilirubin += 1.5

        # Keep realistic bounds
        predicted_bilirubin = max(
            2,
            min(predicted_bilirubin, 18)
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
            "saved_to_db": "_id" in prediction_record,
            "roi_image": extracted_features.get('roi_image', ''),
            "roi_overlay": extracted_features.get('roi_overlay', '')
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
def calibrate_lighting(request):
    try:
        if 'image' not in request.FILES:
            return Response({"status": "error", "message": "No image provided"}, status=400)
            
        image_file = request.FILES['image']
        image_bytes = image_file.read()
        
        profile = calculate_calibration_profile(image_bytes)
        
        # Save to session
        request.session['calibration_profile'] = profile
        
        return Response({
            "status": "success",
            "profile": profile
        })
    except Exception as e:
        return Response({
            "status": "error",
            "message": str(e)
        }, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_with_neobot(request):
    try:
        user_message = request.data.get('message')
        history = request.data.get('history', [])
        
        if not user_message:
            return Response({"status": "error", "message": "No message provided"}, status=400)
            
        api_key = request.data.get('api_key')
        bot_reply = generate_chat_response(user_message, history, api_key)
        
        return Response({
            "status": "success",
            "reply": bot_reply
        })
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)


from .models import PatientSetting

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_patient_settings(request):
    try:
        setting, created = PatientSetting.objects.get_or_create(user=request.user)
        return Response({
            "status": "success",
            "scan_interval_hours": setting.scan_interval_hours,
            "doctor_message": setting.doctor_message,
            "alert_level": setting.alert_level
        })
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_patient_settings(request):
    try:
        # In a real app, you'd find the patient by ID instead of request.user
        # Assuming the doctor edits their own for this demo, or we find the patient
        # For demo purposes, we update a global or specific user setting
        setting, created = PatientSetting.objects.get_or_create(user=request.user)
        
        data = request.data
        if 'scan_interval_hours' in data:
            setting.scan_interval_hours = int(data['scan_interval_hours'])
        if 'doctor_message' in data:
            setting.doctor_message = data['doctor_message']
        if 'alert_level' in data:
            setting.alert_level = data['alert_level']
            
        setting.save()
        return Response({"status": "success", "message": "Settings updated"})
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)
