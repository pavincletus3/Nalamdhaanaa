from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load trained model pipeline
MODEL_PATH = "../symptom_classifier.pkl"
model = joblib.load(MODEL_PATH)

def get_specialty(condition_name):
    # Simple keyword-based specialty mapping (expand as needed)
    specialty_mapping = {
    # Skin related
    "skin": "Dermatologist",
    "acne": "Dermatologist",
    "rash": "Dermatologist",
    "rashes": "Dermatologist",
    "sores": "Dermatologist",
    "psoriasis": "Dermatologist",
    "impetigo": "Dermatologist",
    "fungal": "Dermatologist",

    # Respiratory
    "cough": "Pulmonologist",
    "asthma": "Pulmonologist",
    "breathing": "Pulmonologist",
    "throat": "ENT (Otolaryngologist)",
    "chest": "Pulmonologist / Cardiologist",

    # Pain related/general
    "pain": "General Physician / Pain Management",
    "joint": "Rheumatologist / Orthopedist",
    "headache": "Neurologist",
    "migraine": "Neurologist",
    "stomach": "Gastroenterologist",
    "abdominal": "Gastroenterologist",

    # Vascular
    "legs": "Vascular Surgeon / General Physician",
    "varicose": "Vascular Surgeon",

    # Urinary
    "pee": "Urologist",
    "urinary": "Urologist",
    "kidney": "Nephrologist",

    # Infectious/fever related
    "fever": "General Physician / Infectious Disease",
    "infection": "Infectious Disease",

    # Endocrine/metabolic
    "diabetes": "Endocrinologist",
    "thyroid": "Endocrinologist",

    # Mental health
    "anxiety": "Psychiatrist",
    "depression": "Psychiatrist",

    # Blood
    "jaundice": "Hepatologist / Gastroenterologist",
    "blood": "Hematologist",

    # Others
    "drug": "Pharmacist / Toxicologist",
    "allergy": "Allergist / Immunologist"
}

    condition_lower = condition_name.lower()
    for keyword, specialty in specialty_mapping.items():
        if keyword in condition_lower:
            return specialty
    return "General Physician"

@app.route('/api/predict-symptoms', methods=['POST'])
def predict_symptoms():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        symptoms = data.get('symptoms', '')
        
        if not symptoms or len(symptoms.strip()) < 3:
            return jsonify({"error": "Please provide detailed symptoms (at least 3 characters)"}), 400
        
        print(f"Analyzing symptoms: {symptoms}")  # Debug logging
        
        # Make prediction
        probs = model.predict_proba([symptoms])[0]
        classes = model.classes_

        # Get top 3 predictions
        top_n = 3
        sorted_indices = np.argsort(probs)[::-1][:top_n]

        results = []
        for i in sorted_indices:
            condition = classes[i]
            confidence = float(probs[i])
            specialty = get_specialty(condition)
            results.append({
                "condition": condition,
                "confidence": confidence,
                "specialty": specialty
            })

        print(f"Predictions: {results}")  # Debug logging
        
        return jsonify({
            "input": symptoms,
            "predictions": results
        }), 200
        
    except Exception as e:
        print(f"Error in predict_symptoms: {str(e)}")  # Debug logging
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "healthy", "message": "Custom chatbot API is running"}), 200

if __name__ == '__main__':
    app.run(debug=True)
