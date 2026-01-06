from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import os
try:
    from google import genai
    from google.genai import types
    HAS_GEMINI = True
except ImportError:
    print("⚠️  google-genai not installed. Falling back to local NLP.")
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
    print(f"DEBUG: Loaded API Key starting with: {GEMINI_API_KEY[:10]}...")
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        model_name = 'gemini-1.5-flash'
    except Exception as e:
        print(f"Failed to initialize Gemini: {e}")
        client = None
else:
    client = None

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
        if not client:
            return None
        response = client.models.generate_content(
            model=model_name,
            contents=prompt
        )
        # Clean up potential markdown formatting in response
        result_text = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(result_text)
    except Exception as e:
        print(f"Gemini Parsing Error: {e}")
        return None

# --- Helper: Basic Resume Parser (Spacy Fallback) ---
def parse_resume_with_spacy(text):
    if not nlp:
        return {"technical_skills": [], "soft_skills": [], "role": "Unknown", "seniority": "Unknown"}
        
    # Setup EntityRuler if not exists
    if "entity_ruler" not in nlp.pipe_names:
        ruler = nlp.add_pipe("entity_ruler", before="ner")
        skills = [
            # Initally populated with common tech skills
            "Python", "Java", "C++", "C#", "JavaScript", "TypeScript", "React", "Angular", "Vue", "Node.js",
            "SQL", "NoSQL", "MongoDB", "PostgreSQL", "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Git",
            "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Data Science", "Flask", "Django",
            "FastAPI", "HTML", "CSS", "Tailwind", "Bootstrap", "Linux", "Windows", "MacOS", "Agile", "Scrum",
            "Rust", "Go", "Kotlin", "Swift", "Flutter", "React Native", "Jenkins", "CI/CD", "Terraform"
        ]
        patterns = [{"label": "SKILL", "pattern": [{"LOWER": skill.lower()}]} for skill in skills]
        ruler.add_patterns(patterns)

    doc = nlp(text)
    found_skills = set()
    for ent in doc.ents:
        if ent.label_ == "SKILL":
            found_skills.add(ent.text.capitalize())
            
    # Also check for simple string matches if NER misses
    known_skills_set = {"communication", "leadership", "teamwork", "problem solving", "time management"}
    soft_skills = set()
    for token in doc:
        if token.text.lower() in known_skills_set:
            soft_skills.add(token.text.capitalize())

    return {
        "technical_skills": list(found_skills),
        "soft_skills": list(soft_skills),
        "role": "General Professional (Spacy)",
        "seniority": "Junior-Mid"
    }

@app.route('/extract-skills', methods=['POST'])
def extract_skills_endpoint():
    text = request.json.get('text', '')
    if not text:
        return jsonify({"error": "No text provided"}), 400
        
    analysis = parse_resume_with_spacy(text)
    return jsonify(analysis)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "AI Service is running",
        "nlp_model_loaded": nlp is not None,
        "gemini_active": client is not None,
        "api_key_configured": GEMINI_API_KEY is not None
    }), 200

@app.route('/predict-trend', methods=['POST'])
def predict_trend():
    data = request.json
    skill = data.get('skill', 'unknown')
    
    if client:
        try:
            prompt = f"Provide a skill trend analysis for '{skill}'. Is it growing, stable, or declining? Provide a score from 0-100. Return ONLY a JSON object: {{'trend': '...', 'score': 0-100, 'reason': '...'}}"
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )
            result_text = response.text.replace("```json", "").replace("```", "").strip()
            return jsonify(json.loads(result_text))
        except Exception as e:
            print(f"Prediction Error: {e}")
            
    return jsonify({
        "skill": skill, 
        "trend": "Growing", 
        "score": 85, 
        "reason": "Market demand is consistently high (AI Unavailable).",
        "warning": "AI Offline: Using fallback trend data."
    })

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
        if client and text.strip():
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
    if not client:
        return jsonify({"error": "Gemini not configured"}), 503
        
    data = request.json
    skill = data.get('skill', '')
    
    try:
        if not client:
            raise Exception("Gemini not configured")
            
        prompt = f"List 5 highly related technical skills for someone who knows '{skill}'. Return as a JSON array of strings: ['skill1', 'skill2', ...]"
        response = client.models.generate_content(
            model=model_name,
            contents=prompt
        )
        result_text = response.text.replace("```json", "").replace("```", "").strip()
        related = json.loads(result_text)
        return jsonify({"skill": skill, "related_skills": related})
    except Exception as e:
        print(f"AI Error (Semantic Skills): {e}")
        # Fallback for demo/offline mode
        fallback_map = {
            "python": ["Django", "Flask", "Pandas", "NumPy", "Data Science"],
            "react": ["Redux", "TypeScript", "Next.js", "Tailwind", "JavaScript"],
            "node.js": ["Express", "MongoDB", "NestJS", "TypeScript", "AWS"],
            "sql": ["PostgreSQL", "MySQL", "Database Design", "NoSQL", "Snowflake"],
            "aws": ["Docker", "Kubernetes", "Terraform", "CloudFormation", "Linux"]
        }
        fallback = fallback_map.get(skill.lower(), ["Communication", "Problem Solving", "Git", "Agile", "Linux"])
        return jsonify({
            "skill": skill, 
            "related_skills": fallback, 
            "warning": "AI Offline: Using cached data (API Key likely expired)"
        })

# --- SerpApi Integration (Real-time Jobs) ---
from serpapi import GoogleSearch

@app.route('/jobs', methods=['GET'])
def get_jobs():
    skill = request.args.get('skill', 'Software Engineer')
    location = request.args.get('location', 'Remote')
    
    # Use provided key or env var
    api_key = os.getenv("SERPAPI_KEY") or "bda925bb735d94acc0c642067a987a39955cbcc2eeb2864f50e33b86be70b251"
    
    try:
        params = {
            "engine": "google_jobs",
            "q": f"{skill} jobs in {location}",
            "api_key": api_key,
            "num": 10
        }
        
        search = GoogleSearch(params)
        results = search.get_dict()
        
        jobs_results = results.get("jobs_results", [])
        
        # Simplify response
        simplified_jobs = []
        for job in jobs_results:
            simplified_jobs.append({
                "title": job.get("title"),
                "company_name": job.get("company_name"),
                "location": job.get("location"),
                "description": job.get("description"),
                "detected_extensions": job.get("detected_extensions", {}),
                "thumbnail": job.get("thumbnail")
            })
            
        return jsonify({"skill": skill, "count": len(simplified_jobs), "jobs": simplified_jobs})
        
    except Exception as e:
        print(f"SerpApi Error: {e}")
        return jsonify({"error": f"Job fetch failed: {str(e)}"}), 500

# --- Advanced Forecasting (Statsmodels) ---
import pandas as pd
from statsmodels.tsa.holtwinters import ExponentialSmoothing

@app.route('/forecast', methods=['POST'])
def forecast():
    data = request.json
    history = data.get('history', [])
    years = data.get('years', 3) 
    
    if not history or len(history) < 2:
        return jsonify({"error": "Not enough data for forecasting"}), 400
        
    try:
        # Handle dict list or simple list
        values = []
        last_year = 2024
        
        if isinstance(history[0], dict):
             values = [float(h.get('demand_score', 0)) for h in history]
             if 'year' in history[-1]:
                 last_year = int(history[-1]['year'])
        else:
             values = [float(x) for x in history]
             
        series = pd.Series(values)
        
        # Holt-Winters Exponential Smoothing
        model = ExponentialSmoothing(series, trend='add', seasonal=None, damped_trend=True)
        fit = model.fit()
        pred = fit.forecast(years)
        
        forecast_values = pred.tolist()
        
        response = []
        for i, val in enumerate(forecast_values):
             response.append({"year": last_year + i + 1, "demand_score": round(val, 2)})
             
        return jsonify({"skill": data.get('skill', 'Unknown'), "forecast": response})
        
    except Exception as e:
        print(f"Forecast Error: {e}")
        return jsonify({"error": str(e)}), 500

# --- Sentiment Analysis ---
from textblob import TextBlob

@app.route('/analyze-sentiment', methods=['POST'])
def analyze_sentiment():
    text = request.json.get('text', '')
    if not text:
        return jsonify({"error": "No text provided"}), 400
        
    blob = TextBlob(text)
    sentiment_score = blob.sentiment.polarity
    subjectivity_score = blob.sentiment.subjectivity
    
    sentiment = "Neutral"
    if sentiment_score > 0.1:
        sentiment = "Positive"
    elif sentiment_score < -0.1:
        sentiment = "Negative"
        
    return jsonify({
        "sentiment": sentiment,
        "score": sentiment_score,
        "subjectivity": subjectivity_score
    })

# --- Mentor Bot Chat Endpoint ---
@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    history = data.get('history', []) # Optional: specialized context
    
    if not message:
        return jsonify({"error": "No message provided"}), 400

    if not client:
        return jsonify({
            "response": "I see you're interested in career growth! 🚀 \n\n(Note: I am currently in Offline Demo Mode because my AI connection is unavailable. Please verify your Google API Key to unlock my full potential. In the meantime, try uploading a resume or checking the Dashboard!)",
            "source": "System (Offline)"
        })

    try:
        # Construct a persona-based prompt
        system_instruction = """You are "Propel", an advanced AI Career Mentor and Skill Evolution Guide. 
        Your goal is to help users navigate their career path, suggest skills, and provide actionable advice.
        Tone: Professional, encouraging, futuristic, and concise.
        Do not answer questions unrelated to technology, career, skills, or professional development.
        If asked about the platform, explain that this is the "Predictive Skill Evolution Platform".
        """
        
        prompt = f"{system_instruction}\n\nUser: {message}\nAI:"
        
        response = client.models.generate_content(
            model=model_name,
            contents=prompt
        )
        
        return jsonify({
            "response": response.text,
            "source": "Gemini"
        })
        
    except Exception as e:
        print(f"Chat Error: {e}")
        return jsonify({"error": "I lost my train of thought. Please try again."}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
