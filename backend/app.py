from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env

openai.api_key = os.getenv("OPENAI_API_KEY")

#print(openai.api_key)

app = Flask(__name__)
CORS(app)

#openai.api_key = OPENAI_API_KEY  # Store securely in .env for production

@app.route('/autocomplete', methods=['POST'])
def autocomplete():
    data = request.json
    code = data.get('code', '')
    language = data.get('language', 'Java')

    system_prompt = f"You are an expert {language} developer. Complete the following code snippet with best practices. Make sure the syntax is correct and runnable."

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": code}
            ],
            max_tokens=100,
            temperature=0.3
        )

        completion = response['choices'][0]['message']['content']
        return jsonify({'completion': completion})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
