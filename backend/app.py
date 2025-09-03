from flask import Flask, request, jsonify
from flask_cors import CORS
from extractor import extract_info
from bs4 import BeautifulSoup
import requests
from sentence_transformers import SentenceTransformer, util
import json
import os

app = Flask(__name__)
frontend_origins = [
    "http://localhost:3000",  # local dev frontend
    os.environ.get("VERCEL_FRONTEND_URL", "https://cookiepookie-ten.vercel.app")
]

CORS(app, origins=frontend_origins)

# Load the SentenceTransformer model once
model = SentenceTransformer('all-MiniLM-L6-v2')


def get_policy_text(url):
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        policy_text = ''

        for tag in soup.find_all(['p', 'div', 'section']):
            text = tag.get_text(separator=' ', strip=True)
            if text:
                policy_text += text + ' '

        return policy_text.strip()
    except Exception as e:
        print(f"Error fetching policy text: {e}")
        return ""


def calculate_similarity(banner, policy_text):
    if not banner or not policy_text:
        return 0.0

    embeddings = model.encode([banner, policy_text], convert_to_tensor=True)
    cosine_sim = util.pytorch_cos_sim(embeddings[0], embeddings[1])
    return float(cosine_sim[0][0])


def label_similarity(score):
    if score > 0.75:
        return "Highly Accurate"
    elif score > 0.5:
        return "Moderately Accurate"
    else:
        return "Misleading or Inaccurate"


@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    url = data.get('url')

    if not url:
        return jsonify({'error': 'URL is required'}), 400

    info = extract_info(url)
    if not info:
        return jsonify({'error': 'Unable to extract information from the URL'}), 400

    banner_text = info.get("banner")
    policy_link = info.get("policy_link")

    if not banner_text or not policy_link:
        return jsonify({'error': 'Unable to find banner or policy link'}), 400

    policy_text = get_policy_text(policy_link)
    similarity_score = calculate_similarity(banner_text, policy_text)
    label = label_similarity(similarity_score)

    result = {
        "url": url,
        "banner": banner_text,
        "policy_link": policy_link,
        "similarity_score": similarity_score,
        "label": label,
        "has_opt_out": info.get("has_opt_out", False)
    }

    # Save to one JSON file as a list
    os.makedirs("outputs", exist_ok=True)
    output_file = os.path.join("outputs", "results.json")

    if os.path.exists(output_file):
        with open(output_file, "r", encoding="utf-8") as f:
            existing_data = json.load(f)
    else:
        existing_data = []

    existing_data.append(result)

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(existing_data, f, indent=4)

    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
