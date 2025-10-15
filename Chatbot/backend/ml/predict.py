# # backend/ml/predict.py
# import joblib
# import os
# import json
# import numpy as np

# # Load model
# MODEL_PATH = os.path.join(os.path.dirname(__file__), "/Users/batcomputer/Desktop/health-assistant/symptom_condition_model.pkl")
# model = joblib.load(MODEL_PATH)

# # Optional knowledge base for triage and guidance
# KNOWLEDGE_BASE_PATH = os.path.join(os.path.dirname(__file__), "../models/knowledge_base.json")
# if os.path.exists(KNOWLEDGE_BASE_PATH):
#     with open(KNOWLEDGE_BASE_PATH, "r") as f:
#         knowledge_base = json.load(f)
# else:
#     knowledge_base = {}

# def predict_condition(user_text, top_n=3):
#     """
#     Predict likely conditions from user symptom description.
#     """
#     # Get prediction probabilities
#     probs = model.predict_proba([user_text])[0]
#     classes = model.classes_

#     # Sort by confidence
#     sorted_idx = np.argsort(probs)[::-1]
#     top_conditions = [
#         {"condition": classes[i], "confidence": float(probs[i])}
#         for i in sorted_idx[:top_n]
#     ]

#     # Add guidance info if available
#     for item in top_conditions:
#         condition = item["condition"]
#         def get_triage_level(condition_name):
#             triage_rules = {
#                 "fever": "General Physician",
#                 "cough": "General Physician",
#                 "heart": "Cardiology",  
#                 "skin": "Dermatology",
#                 "headache": "Neurology",
#                 "stomach": "Gastroenterology",
#                 "pain": "Orthopedic",
#                 "anxiety": "Psychiatry",
#                 "infection": "Infectious Diseases"
#             }
#             for keyword, dept in triage_rules.items():
#                 if keyword.lower() in condition_name.lower():
#                     return dept
#             return dept

# # inside predict_condition
#     for item in top_conditions:
#         condition = item["condition"]
#         triage = get_triage_level(condition)
#         item["triage_level"] = triage
#         item["guidance"] = f"Consult a {triage} specialist if symptoms persist."


#     return top_conditions


# # Quick test
# if __name__ == "__main__":
#     text = input("Enter your symptoms: ")
#     results = predict_condition(text)
#     for r in results:
#         print(f"Condition: {r['condition']} | Confidence: {r['confidence']:.2f} | Triage: {r['triage_level']}")
# backend/ml/predict.py
import joblib
import os
import json
import numpy as np
from datetime import datetime


# === CONFIGURATION ===
MODEL_PATH = os.path.join(os.path.dirname(__file__), 
                         "/Users/batcomputer/Desktop/health-assistant/symptom_condition_model.pkl")
METADATA_PATH = os.path.join(os.path.dirname(__file__), 
                            "../models/model_metadata.json")
KNOWLEDGE_BASE_PATH = os.path.join(os.path.dirname(__file__), 
                                   "../models/knowledge_base.json")

# Load model
try:
    model = joblib.load(MODEL_PATH)
    print("✅ Model loaded successfully")
except Exception as e:
    raise Exception(f"Failed to load model: {e}")

# Load metadata if available
metadata = {}
if os.path.exists(METADATA_PATH):
    with open(METADATA_PATH, "r") as f:
        metadata = json.load(f)

# Load knowledge base if available
knowledge_base = {}
if os.path.exists(KNOWLEDGE_BASE_PATH):
    with open(KNOWLEDGE_BASE_PATH, "r") as f:
        knowledge_base = json.load(f)


# === MEDICAL DISCLAIMER ===
MEDICAL_DISCLAIMER = """
⚠️ IMPORTANT DISCLAIMER:
This AI symptom checker is NOT a substitute for professional medical advice, 
diagnosis, or treatment. Always seek the advice of your physician or other 
qualified health provider with any questions about a medical condition.

If you think you may have a medical emergency, call 911 or go to the nearest 
emergency room immediately.
"""


# === EMERGENCY DETECTION ===
def get_emergency_severity(condition_name, user_text, confidence):
    """
    Classify into 5-level ESI (Emergency Severity Index) triage system
    Based on standardized emergency department triage protocols
    """
    
    # Level 1: Critical - Life-threatening
    level_1_keywords = [
        "chest pain", "heart attack", "cardiac arrest", 
        "difficulty breathing", "can't breathe", "respiratory arrest",
        "stroke", "unable to speak", "paralysis", "face drooping",
        "severe bleeding", "hemorrhage", "uncontrolled bleeding",
        "unconscious", "loss of consciousness", "not responding",
        "severe head injury", "major trauma", "seizure ongoing",
        "choking", "severe burns", "severe allergic reaction"
    ]
    
    # Level 2: Emergency - High risk, needs rapid care
    level_2_keywords = [
        "severe pain", "acute pain", "crushing pain", "intense pain",
        "confusion", "altered mental status", "disoriented", "delirious",
        "high fever with stiff neck", "severe infection", "sepsis",
        "open fracture", "penetrating wound", "deep wound",
        "coughing blood", "vomiting blood", "blood in stool",
        "severe headache", "worst headache of life",
        "suicidal thoughts", "want to harm", "overdose"
    ]
    
    # Level 3: Urgent - Stable but needs timely care
    level_3_keywords = [
        "moderate pain", "persistent fever", "dehydration", "dizziness",
        "urinary retention", "severe vomiting", "severe diarrhea",
        "abdominal pain", "back pain", "migraine", "fracture",
        "infection", "rash spreading", "eye injury"
    ]
    
    user_lower = user_text.lower()
    
    # Check Level 1: CRITICAL
    if any(keyword in user_lower for keyword in level_1_keywords):
        return {
            "esi_level": 1,
            "severity": "CRITICAL - LIFE THREATENING",
            "action": "🚨 CALL 108 IMMEDIATELY 🚨",
            "wait_time": "0 minutes - Immediate intervention required",
            "warning": "⚠️ EMERGENCY: This is a medical emergency. Call 108 or go to the nearest emergency room NOW. Do not wait.",
            "color_code": "red"
        }
    
    # Check Level 2: EMERGENT
    if any(keyword in user_lower for keyword in level_2_keywords):
        return {
            "esi_level": 2,
            "severity": "EMERGENT - High Risk",
            "action": "Go to Emergency Department immediately",
            "wait_time": "<15 minutes",
            "warning": "⚠️ Urgent medical attention required within 15 minutes. Go to the ER now.",
            "color_code": "orange"
        }
    
    # Check Level 3: URGENT
    if any(keyword in user_lower or keyword in condition_name.lower() 
           for keyword in level_3_keywords):
        return {
            "esi_level": 3,
            "severity": "URGENT",
            "action": "Visit Urgent Care or Emergency Department within 1-2 hours",
            "wait_time": "1-2 hours",
            "warning": "Medical evaluation needed within 1-2 hours.",
            "color_code": "yellow"
        }
    
    # Level 4: Semi-urgent
    if confidence >= 0.6:
        return {
            "esi_level": 4,
            "severity": "Semi-Urgent",
            "action": "Schedule appointment with doctor within 24-48 hours",
            "wait_time": "1-2 days",
            "warning": None,
            "color_code": "green"
        }
    
    # Level 5: Non-urgent
    return {
        "esi_level": 5,
        "severity": "Non-Urgent",
        "action": "Monitor symptoms and consult primary care if persists",
        "wait_time": "3-7 days as needed",
        "warning": None,
        "color_code": "blue"
    }


def get_specialty_recommendation(condition_name):
    """
    Route to appropriate medical specialty based on condition
    """
    specialty_mapping = {
        "fever": "General Physician",
        "cough": "Pulmonology / General Physician",
        "heart": "Cardiology",
        "cardiac": "Cardiology",
        "chest": "Cardiology / Pulmonology",
        "skin": "Dermatology",
        "rash": "Dermatology",
        "headache": "Neurology",
        "migraine": "Neurology",
        "stomach": "Gastroenterology",
        "abdominal": "Gastroenterology",
        "digestive": "Gastroenterology",
        "pain": "Pain Management / Orthopedics",
        "joint": "Rheumatology / Orthopedics",
        "bone": "Orthopedics",
        "fracture": "Orthopedics",
        "anxiety": "Psychiatry / Mental Health",
        "depression": "Psychiatry / Mental Health",
        "stress": "Psychiatry / Mental Health",
        "infection": "Infectious Disease",
        "diabetes": "Endocrinology",
        "thyroid": "Endocrinology",
        "kidney": "Nephrology",
        "liver": "Hepatology / Gastroenterology",
        "respiratory": "Pulmonology",
        "breathing": "Pulmonology",
        "asthma": "Pulmonology",
        "eye": "Ophthalmology",
        "vision": "Ophthalmology",
        "ear": "Otolaryngology (ENT)",
        "throat": "Otolaryngology (ENT)",
        "nose": "Otolaryngology (ENT)",
        "pregnancy": "Obstetrics / Gynecology",
        "gynecology": "Obstetrics / Gynecology",
        "urinary": "Urology",
        "bladder": "Urology",
        "blood": "Hematology",
        "anemia": "Hematology"
    }
    
    condition_lower = condition_name.lower()
    
    for keyword, specialty in specialty_mapping.items():
        if keyword in condition_lower:
            return specialty
    
    return "General Physician"


def assess_confidence_reliability(confidence):
    """
    Determine prediction reliability and recommended action
    """
    if confidence >= 0.75:
        return {
            "reliability": "High",
            "description": "AI prediction has high confidence",
            "needs_followup": False
        }
    elif confidence >= 0.50:
        return {
            "reliability": "Moderate",
            "description": "AI prediction is uncertain. Additional questions recommended.",
            "needs_followup": True
        }
    else:
        return {
            "reliability": "Low",
            "description": "AI cannot determine condition reliably. Please consult healthcare professional.",
            "needs_followup": True
        }


def predict_condition(user_text, top_n=3):
    """
    Predict likely conditions from user symptom description with safety guardrails
    
    Args:
        user_text: User's symptom description
        top_n: Number of top predictions to return
        
    Returns:
        dict containing predictions, emergency assessment, and safety information
    """
    
    # Input validation
    if not user_text or len(user_text.strip()) < 3:
        return {
            "error": "Please provide a detailed description of your symptoms",
            "predictions": []
        }
    
    try:
        # Get prediction probabilities
        probs = model.predict_proba([user_text])[0]
        classes = model.classes_
        
        # Sort by confidence
        sorted_idx = np.argsort(probs)[::-1]
        
        # Build top predictions
        top_conditions = []
        for i in sorted_idx[:top_n]:
            condition = classes[i]
            confidence = float(probs[i])
            
            # Get specialty recommendation
            specialty = get_specialty_recommendation(condition)
            
            # Assess confidence reliability
            reliability = assess_confidence_reliability(confidence)
            
            top_conditions.append({
                "condition": condition,
                "confidence": confidence,
                "confidence_percentage": f"{confidence * 100:.1f}%",
                "specialty": specialty,
                "reliability": reliability["reliability"],
                "needs_followup_questions": reliability["needs_followup"]
            })
        
        # Emergency severity assessment (use top prediction)
        top_condition = top_conditions[0]["condition"]
        top_confidence = top_conditions[0]["confidence"]
        emergency_assessment = get_emergency_severity(
            top_condition, user_text, top_confidence
        )
        
        # Compile response
        response = {
            "timestamp": datetime.now().isoformat(),
            "user_input": user_text,
            "emergency_severity": emergency_assessment,
            "predictions": top_conditions,
            "disclaimer": MEDICAL_DISCLAIMER,
            "model_info": {
                "accuracy": metadata.get("test_accuracy", "Unknown"),
                "training_date": metadata.get("training_date", "Unknown")
            }
        }
        
        return response
        
    except Exception as e:
        return {
            "error": f"Prediction failed: {str(e)}",
            "predictions": [],
            "disclaimer": MEDICAL_DISCLAIMER
        }


# === TESTING ===
if __name__ == "__main__":
    print("=== AI Symptom Checker ===")
    print(MEDICAL_DISCLAIMER)
    print("\n" + "="*60 + "\n")
    
    # Test cases
    test_cases = [
        "I have rash on my skin",
        "I have had a red eye and my vision has been damaged for the a while now",
        "I have cystic acne on my skin"
    ]
    
    for test in test_cases:
        print(f"\n🧪 TEST: '{test}'")
        results = predict_condition(test)
        
        if "error" not in results:
            # Display emergency assessment
            emergency = results["emergency_severity"]
            print(f"\n⚠️ SEVERITY: {emergency['severity']} (ESI Level {emergency['esi_level']})")
            print(f"   ACTION: {emergency['action']}")
            if emergency.get("warning"):
                print(f"   ⚠️  {emergency['warning']}")
            
            # Display predictions
            print(f"\n📊 TOP PREDICTIONS:")
            for idx, pred in enumerate(results["predictions"], 1):
                print(f"   {idx}. {pred['condition']}")
                print(f"      Confidence: {pred['confidence_percentage']} ")
                print(f"      Specialty: {pred['specialty']}")
        else:
            print(f"❌ Error: {results['error']}")
        
        print("\n" + "-"*60)

