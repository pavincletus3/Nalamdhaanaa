#!/bin/bash

echo "Starting Custom Chatbot Backend..."
echo

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/backend"

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing/updating dependencies..."
pip install flask flask-cors joblib numpy scikit-learn

echo
echo "Starting Flask server..."
echo "Backend will be available at: http://localhost:5000"
echo "Press Ctrl+C to stop the server"
echo

python app.py