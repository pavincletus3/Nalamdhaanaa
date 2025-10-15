# Custom Chatbot Integration Setup

This document explains how to set up and use your custom NLP chatbot with the HealthAssist frontend.

## Backend Setup

1. **Navigate to your Chatbot backend directory:**

   ```bash
   cd ../Chatbot/backend
   ```

2. **Activate your virtual environment:**

   ```bash
   # On Windows
   venv\Scripts\activate

   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install required dependencies:**

   ```bash
   pip install flask joblib numpy scikit-learn flask-cors
   ```

4. **Start the Flask server:**

   ```bash
   python app.py
   ```

   The server should start on `http://localhost:5000`

## Frontend Integration

The frontend now supports both chatbot modes:

### Custom NLP Mode (Default)

- Uses your trained symptom classifier model
- Provides specific condition predictions with confidence scores
- Recommends appropriate medical specialists
- Optimized for symptom analysis

### Gemini AI Mode (Fallback)

- Uses Google's Gemini AI for general health assistance
- Preserved as a fallback option
- Requires API_KEY environment variable

## Usage

1. **Start the backend server** (see Backend Setup above)
2. **Start the frontend:**
   ```bash
   npm run dev
   ```
3. **Navigate to the Chat page** in the HealthAssist app
4. **Click the Settings icon** (⚙️) in the top-right corner of the chat
5. **Select your preferred chatbot mode:**
   - **Custom NLP (Recommended)**: Uses your trained model
   - **Gemini AI (Fallback)**: Uses Google's AI

## Features

### Custom NLP Chatbot Features:

- Symptom analysis using your trained model
- Condition predictions with confidence scores
- Medical specialist recommendations
- Structured health guidance
- Red flag symptom warnings

### Mode Switching:

- Easy toggle between custom and Gemini AI
- Real-time mode indicator
- Different input placeholders for each mode
- Mode-specific disclaimers

## Troubleshooting

### Backend Issues:

- **"Service unavailable" error**: Make sure the Flask server is running on localhost:5000
- **Model loading errors**: Ensure `symptom_classifier.pkl` is in the backend directory
- **CORS errors**: Install flask-cors: `pip install flask-cors`

### Frontend Issues:

- **Mode not switching**: Check browser console for errors
- **API calls failing**: Verify backend server is accessible at localhost:5000

## API Endpoint

The custom chatbot uses the following endpoint:

- **URL**: `http://localhost:5000/api/predict-symptoms`
- **Method**: POST
- **Body**: `{ "symptoms": "user input text" }`
- **Response**:
  ```json
  {
    "input": "user symptoms",
    "predictions": [
      {
        "condition": "condition name",
        "confidence": 0.85,
        "specialty": "recommended specialist"
      }
    ]
  }
  ```

## Notes

- The Gemini integration is preserved but commented in the code
- Both modes can be used simultaneously by different users
- The custom NLP mode is set as default for better user experience
- All existing functionality remains intact
