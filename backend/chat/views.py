from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from dotenv import load_dotenv
import google.generativeai as genai
import os

# Load environment variables and configure Gemini
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# =========================
# 💬 AURORA - Custom AI Agent
# =========================
@csrf_exempt
@api_view(['POST'])
def chat_with_ai(request):
    try:
        user_message = request.data.get("message", "").strip().lower()

        if not user_message:
            return Response({"reply": "Please enter a message."}, status=400)

        # --- Custom personality / FAQ responses ---
        custom_responses = {
            "who are you": "I’m Aurora — Parsa Meshkini’s personal AI assistant. I help answer questions about him, his work, and his portfolio.",
            "what are you": "I’m Aurora, an AI assistant created by Parsa Meshkini to represent him online.",
            "who is parsa": "Parsa Meshkini is a Computer Science student at York University with a strong passion for web development, design, and artificial intelligence.",
            "tell me about parsa": "Parsa Meshkini is a Computer Science student at York University, skilled in Python, Django, React, and AI technologies.",
            "what does parsa study": "Parsa is studying Computer Science at York University in Toronto, Canada.",
            "where does parsa live": "Parsa currently lives in Toronto, Canada.",
            "what is aurora": "Aurora is an AI assistant created by Parsa Meshkini. My purpose is to represent him and make his digital presence more interactive.",
            "how can i contact parsa": "You can contact Parsa via email at pameshkini@gmail.com or through his website at www.parsameshkini.com.",
            "what can you do": "I can answer questions about Parsa, his projects, and his portfolio — or just chat with you if you want to talk about tech and creativity!",
        }

        # Match custom replies by keyword
        for key, reply in custom_responses.items():
            if key in user_message:
                return Response({"reply": reply})

        # --- Fallback to Gemini API ---
        model = genai.GenerativeModel("gemini-2.5-flash")
        context = (
            "You are Aurora, a helpful and polite AI assistant built by Parsa Meshkini. "
            "If the user asks about Parsa, respond as his personal assistant. "
            "If they ask about you, introduce yourself as Aurora. "
            "Keep responses short, warm, and conversational."
        )

        full_prompt = f"{context}\nUser: {user_message}\nAurora:"

        response = model.generate_content(full_prompt)
        answer = (
            response.text
            if hasattr(response, "text") and response.text
            else "Sorry, I didn’t understand that."
        )

        return Response({"reply": answer})

    except Exception as e:
        return render(request, "404.html", status=404)
