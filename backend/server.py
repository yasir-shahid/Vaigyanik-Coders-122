from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # Allows React frontend to connect

OLLAMA_URL = "http://localhost:11434/api/generate"

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get("message", "")

    payload = {
        "model": "llama3",
        "prompt": user_message,
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_URL, json=payload)
        response.raise_for_status()
        data = response.json()
        return jsonify({"message": data.get("response", "")})
    except requests.exceptions.RequestException as e:
        return jsonify({"message": f"Error talking to LLaMA 3: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(port=5001)
