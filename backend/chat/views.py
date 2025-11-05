from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from dotenv import load_dotenv
import google.generativeai as genai
import os

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

@api_view(['POST'])
def chat_with_ai(request):
    try:
        user_message = request.data.get("message", "")
        if not user_message.strip():
            return Response({"reply": "Please enter a message."}, status=400)
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(user_message)
        answer = response.text if hasattr(response, "text") and response.text else "Sorry, I didn’t understand that."
        return Response({"reply": answer})
    except Exception as e:
        return Response({"error": str(e)}, status=500)
