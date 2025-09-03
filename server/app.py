from flask import Flask, request, jsonify
from flask_cors import CORS
from extractor import extract_info
import json
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = Flask(__name__)
frontend_origins = [
    "http://localhost:3000",  # local dev frontend
    os.environ.get("VERCEL_FRONTEND_URL", "https://cookiepookie-ten.vercel.app")
]

CORS(app, origins=frontend_origins)

def calculate_similarity(banner, policy_text):
    """Calculate similarity using TF-IDF and cosine similarity instead of heavy transformers"""
    if not banner or not policy_text:
        return 0.0
    
    try:
        # Create TF-IDF vectors
        vectorizer = TfidfVectorizer(
            stop_words='english',
            ngram_range=(1, 2),
            max_features=1000
        )
        
        # Combine texts and fit vectorizer
        texts = [banner, policy_text]
        tfidf_matrix = vectorizer.fit_transform(texts)
        
        # Calculate cosine similarity
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        
        return float(similarity)
    except Exception as e:
        print(f"Error calculating similarity: {e}")
        # Fallback to simple string matching
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