import os
from openai import OpenAI
from django.conf import settings

# This will be replaced with your actual OpenAI API key
OPENAI_API_KEY = "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"

# We initialize the client inside a try-catch to prevent crashing if the key is invalid initially
try:
    client = OpenAI(api_key=OPENAI_API_KEY)
except Exception as e:
    client = None
    print(f"OpenAI Client Error: {e}")

SYSTEM_PROMPT = """
You are NeoBot, an advanced AI medical assistant integrated into the NeoScan AI Neonatal Jaundice Dashboard.
Your role is to assist healthcare professionals and parents by providing clear, accurate, and empathetic information about neonatal jaundice, bilirubin levels, and our AI prediction system.

Key Responsibilities:
1. Explain Jaundice & Bilirubin: Clearly define physiological vs. pathological jaundice.
2. Interpret Risk Zones: If asked about 'Low Risk', 'Intermediate Risk', or 'High Risk' (based on the Bhutani nomogram), explain the clinical implications and standard protocols.
3. System Explanations: Explain how NeoScan AI extracts features from neonatal skin images and uses an XGBoost regression model to estimate bilirubin.
4. Prevention & Care: Offer standard newborn care tips.

Tone & Style:
- Professional, empathetic, and clinical but accessible.
- Use bullet points for readability when appropriate.
- Keep responses concise and structured.

CRITICAL DISCLAIMER:
Always conclude medical advice by briefly reminding the user that you are an AI and they must consult a pediatrician for definitive diagnosis.
"""

def generate_chat_response(user_message, history=None):
    if not client:
        return "Chatbot is currently disabled. Please check the OpenAI API key."
        
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    
    # Append history if provided
    if history:
        for msg in history:
            messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})
            
    # Append the new user message
    messages.append({"role": "user", "content": user_message})
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo", # You can upgrade to gpt-4 or gpt-4o later
            messages=messages,
            max_tokens=250,
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error connecting to OpenAI: {str(e)}"
