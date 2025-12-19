from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import os
try:
    import google.generativeai as genai
    HAS_GEMINI = True
except ImportError:
    print("⚠️  google-generativeai not installed. Falling back to local NLP.")
    HAS_GEMINI = False
from dotenv import load_dotenv
import tempfile
import json
import spacy

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY and HAS_GEMINI:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')
    except Exception as e:
        print(f"Failed to initialize Gemini: {e}")
        model = None
else:
    model = None

# Load NLP model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    nlp = None 

# --- Helper: PDF Text Extraction ---
def extract_text_from_pdf(file_path):
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                content = page.extract_text()
                if content:
                    text += content + "\n"
    except Exception as e:
        print(f"PDF Extraction Error: {e}")
    return text

# --- Helper: Advanced Resume Parser (Gemini) ---
def parse_resume_with_gemini(text):
    prompt = f"""
    You are an expert HR AI. Analyze the following resume text and extract:
    1. A list of technical skills (e.g., Python, React, AWS).
    2. A list of soft skills (e.g., Leadership, Communication).
    3. The candidate's primary job title or role based on their experience.
    4. A brief (1-sentence) assessment of their seniority level (Junior, Mid, Senior, Lead).

    Format the output as a valid JSON object with keys: "technical_skills", "soft_skills", "role", "seniority".
    Return ONLY the raw JSON string.

    Resume Text:
    {text}
    """
    try:
        response = model.generate_content(prompt)
        # Clean up potential markdown formatting in response
        result_text = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(result_text)
    except Exception as e:
        print(f"Gemini Parsing Error: {e}")
        return None

# --- Helper: Basic Resume Parser (Spacy Fallback) ---
def parse_resume_with_spacy(text):
    doc = nlp(text) if nlp else None
    known_skills = {"python", "react", "javascript", "node.js", "sql", "aws", "docker", "java", "c++", "machine learning"}
    found_skills = set()
    if doc:
        for token in doc:
            if token.text.lower() in known_skills:
                found_skills.add(token.text.capitalize())
    return {
        "technical_skills": list(found_skills) if found_skills else ["Python (Detected as default)"],
        "soft_skills": ["Teamwork"],
        "role": "General Professional",
        "seniority": "Junior-Mid"
    }

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "AI Service is running",
        "nlp_model_loaded": nlp is not None,
        "gemini_active": model is not None,
        "api_key_configured": GEMINI_API_KEY is not None
    }), 200

@app.route('/predict-trend', methods=['POST'])
def predict_trend():
    data = request.json
    skill = data.get('skill', 'unknown')
    
    if model:
        try:
            prompt = f"Provide a skill trend analysis for '{skill}'. Is it growing, stable, or declining? Provide a score from 0-100. Return ONLY a JSON object: {{'trend': '...', 'score': 0-100, 'reason': '...'}}"
            response = model.generate_content(prompt)
            result_text = response.text.replace("```json", "").replace("```", "").strip()
            return jsonify(json.loads(result_text))
        except Exception as e:
            print(f"Prediction Error: {e}")
            
    return jsonify({"skill": skill, "trend": "Growing", "score": 85, "reason": "Consistent market demand (Fallback)."})

@app.route('/parse-resume', methods=['POST'])
def parse_resume():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        file.save(temp_file.name)
        temp_path = temp_file.name
    
    try:
        text = extract_text_from_pdf(temp_path)
        
        analysis = None
        if model and text.strip():
            analysis = parse_resume_with_gemini(text)
        
        if not analysis:
            analysis = parse_resume_with_spacy(text)
            
        os.remove(temp_path)
        return jsonify(analysis)
        
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({"error": str(e)}), 500

@app.route('/semantic-skills', methods=['POST'])
def semantic_skills():
    if not model:
        return jsonify({"error": "Gemini not configured"}), 503
        
    data = request.json
    skill = data.get('skill', '')
    
    try:
        prompt = f"List 5 highly related technical skills for someone who knows '{skill}'. Return as a JSON array of strings: ['skill1', 'skill2', ...]"
        response = model.generate_content(prompt)
        result_text = response.text.replace("```json", "").replace("```", "").strip()
        related = json.loads(result_text)
        return jsonify({"skill": skill, "related_skills": related})
    except Exception as e:
        return jsonify({"error": f"Failed to map skills: {e}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)