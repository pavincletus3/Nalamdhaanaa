# # backend/ml/train_model.py
# import pandas as pd
# import joblib
# from sklearn.model_selection import train_test_split
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.linear_model import LogisticRegression
# from sklearn.metrics import classification_report, accuracy_score
# from sklearn.pipeline import Pipeline
# import os

# # === Load dataset ===
# df = pd.read_csv("/Users/batcomputer/Desktop/health-assistant/Symptom2Disease.csv")
# df = df.drop(columns=["Unnamed: 0"], errors="ignore")

# X = df["text"]
# y = df["label"]

# # === Split data ===
# X_train, X_test, y_train, y_test = train_test_split(
#     X, y, test_size=0.2, random_state=42, stratify=y
# )

# # === Build pipeline ===
# model = Pipeline([
#     ("tfidf", TfidfVectorizer(stop_words="english", ngram_range=(1, 2))),
#     ("clf", LogisticRegression(max_iter=1000, solver="lbfgs", multi_class="auto")),
# ])

# # === Train ===
# model.fit(X_train, y_train)

# # === Evaluate ===
# y_pred = model.predict(X_test)
# print("Model Accuracy:", accuracy_score(y_test, y_pred))
# print("Classification Report:\n", classification_report(y_test, y_pred))

# # === Save artifacts ===
# os.makedirs("../models", exist_ok=True)
# joblib.dump(model, "../models/symptom_condition_model.pkl")

# print("✅ Model training complete and saved at ../models/symptom_condition_model.pkl")
# backend/ml/train_model.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score
import joblib

# Load dataset
df = pd.read_csv("Symptom2Disease.csv")

# Basic text cleaning if needed
df['text'] = df['text'].str.lower().str.strip()

X = df['text']
y = df['label']

# Split to train and test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Build pipeline with TF-IDF and Logistic Regression
model = Pipeline([
    ('tfidf', TfidfVectorizer(stop_words='english', ngram_range=(1,2))),
    ('clf', LogisticRegression(max_iter=1000, class_weight='balanced'))
])

# Train model
model.fit(X_train, y_train)

# Predict and evaluate
y_pred = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, y_pred))
print("Classification Report:\n", classification_report(y_test, y_pred))

# Save the model for inference
joblib.dump(model, 'symptom_classifier.pkl')
