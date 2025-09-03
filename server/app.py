from flask import Flask, request, jsonify
from flask_cors import CORS
from extractor import extract_info
import json
import os
import re
import math
from collections import Counter

app = Flask(__name__)
frontend_origins = [
    "http://localhost:3000",  # local dev frontend
    os.environ.get("VERCEL_FRONTEND_URL", os.environ.get("FRONTEND_URL", "https://cookiepookie-ten.vercel.app"))
]

CORS(app, origins=frontend_origins)

def _tokenize(text: str):
    if not text:
        return []
    tokens = re.findall(r"[a-zA-Z0-9]+", text.lower())
    return [t for t in tokens if len(t) > 2]

def _cosine(v1, v2):
    dot = 0.0
    norm1 = 0.0
    norm2 = 0.0
    for k in v1:
        dot += v1[k] * v2.get(k, 0.0)
        norm1 += v1[k] * v1[k]
    for k in v2:
        norm2 += v2[k] * v2[k]
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return dot / (math.sqrt(norm1) + 1e-12) / (math.sqrt(norm2) + 1e-12)

def calculate_similarity(banner, policy_text):
    """Lightweight TF-IDF cosine similarity without external ML deps"""
    if not banner or not policy_text:
        return 0.0

    try:
        tokens1 = _tokenize(banner)
        tokens2 = _tokenize(policy_text)
        if not tokens1 or not tokens2:
            return 0.0

        # Term frequencies
        tf1 = Counter(tokens1)
        tf2 = Counter(tokens2)

        # Document frequencies across two docs
        vocab = set(tf1.keys()) | set(tf2.keys())
        df = {t: (1 if t in tf1 else 0) + (1 if t in tf2 else 0) for t in vocab}

        # IDF with smoothing (N=2)
        N = 2.0
        idf = {t: math.log((N + 1.0) / (df[t] + 1.0)) + 1.0 for t in vocab}

        # TF-IDF vectors
        v1 = {t: tf1.get(t, 0) * idf[t] for t in vocab}
        v2 = {t: tf2.get(t, 0) * idf[t] for t in vocab}

        return float(_cosine(v1, v2))
    except Exception as e:
        print(f"Error calculating similarity: {e}")
        return 1.0 if banner.lower() in policy_text.lower() else 0.0

def label_similarity(score):
    """Label similarity score (same logic as original)"""
    if score > 0.75:
        return "Highly Accurate"
    elif score > 0.5:
        return "Moderately Accurate"
    else:
        return "Misleading or Inaccurate"

@app.route('/analyze', methods=['POST'])
def analyze():
    """Main analysis endpoint - maintains exact same API contract"""
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

    # Calculate similarity using lightweight method
    similarity_score = calculate_similarity(banner_text, info.get("policy_text", ""))
    label = label_similarity(similarity_score)

    result = {
        "url": url,
        "banner": banner_text,
        "policy_link": policy_link,
        "similarity_score": similarity_score,
        "label": label,
        "has_opt_out": info.get("has_opt_out", False)
    }

    # Save to one JSON file as a list (same as original)
    # Use /tmp for serverless environments like Vercel; fallback to local 'outputs'
    base_output_dir = os.environ.get("SERVERLESS_TMP_DIR") or ("/tmp" if os.environ.get("VERCEL") else "outputs")
    output_dir = os.path.join(base_output_dir, "outputs") if base_output_dir == "/tmp" else base_output_dir
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, "results.json")

    if os.path.exists(output_file):
        with open(output_file, "r", encoding="utf-8") as f:
            try:
                existing_data = json.load(f)
            except Exception:
                existing_data = []
    else:
        existing_data = []

    existing_data.append(result)

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(existing_data, f, indent=4)

    return jsonify(result)

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint for deployment platforms"""
    return jsonify({"status": "healthy", "message": "Lightweight backend running"})

if __name__ == '__main__':
    app.run(debug=True, port=5000) 