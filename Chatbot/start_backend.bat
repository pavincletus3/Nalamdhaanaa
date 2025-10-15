@echo off
echo Starting Custom Chatbot Backend...
echo.

cd /d "%~dp0backend"

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing/updating dependencies...
pip install flask flask-cors joblib numpy scikit-learn

echo.
echo Starting Flask server...
echo Backend will be available at: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

python app.py

pause