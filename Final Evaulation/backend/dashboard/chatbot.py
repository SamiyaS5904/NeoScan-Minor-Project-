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
You are NeoBot, a specialized neonatal medical assistant.
You assist doctors and parents in understanding bilirubin levels, jaundice risk zones, 
and basic neonatal care. 
If a user asks about a specific risk zone (e.g., 'High Risk'), explain what it means and 
standard clinical guidelines (e.g., phototherapy, blood tests).
Always include a disclaimer that you are an AI assistant and they should consult a pediatrician.
Keep responses concise, empathetic, and professional.
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
