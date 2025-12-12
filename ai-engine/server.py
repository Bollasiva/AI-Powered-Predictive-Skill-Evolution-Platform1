from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pdfplumber
import os
import spacy

app = Flask(__name__)
CORS(app)

# Load NLP model (ensure you run: python -m spacy download en_core_web_sm)
try:
    nlp = spacy.load("en_core_web_sm")
except:
    nlp = None 

# --- Helper: Resume Parser ---
def extract_skills_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text()
    
    # Simple extraction logic (In production, use a trained NER model)
    # This example looks for capitalized words that match a known skill list
    doc = nlp(text)
    
    # Mock database of skills for matching
    known_skills = {"python", "react", "javascript", "node.js", "sql", "aws", "docker", "java", "c++", "machine learning"}
    found_skills = set()
    
    # Tokenize and match
    for token in doc:
        if token.text.lower() in known_skills:
            found_skills.add(token.text.capitalize())
            
    return list(found_skills)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "AI Service is running"}), 200

@app.route('/predict-trend', methods=['POST'])
def predict_trend():
    # Logic from your original main.py goes here
    # Return JSON directly instead of printing to stdout
    data = request.json
    skill = data.get('skill')
    # ... (Your existing prediction logic) ...
    return jsonify({"skill": skill, "trend": "Growing", "score": 85})

@app.route('/parse-resume', methods=['POST'])
def parse_resume():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    temp_path = f"/tmp/{file.filename}"
    file.save(temp_path)
    
    try:
        skills = extract_skills_from_pdf(temp_path)
        os.remove(temp_path) # Cleanup
        return jsonify({"extracted_skills": skills})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)