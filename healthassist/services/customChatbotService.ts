import { ChatMessage } from "../types";

const CUSTOM_CHATBOT_API_URL = "http://localhost:5000/api/predict-symptoms";

export interface SymptomPrediction {
  condition: string;
  confidence: number;
  specialty: string;
}

export interface CustomChatbotResponse {
  input: string;
  predictions: SymptomPrediction[];
}

export const getCustomChatbotResponse = async (
  chatHistory: ChatMessage[],
  newUserMessage: string
): Promise<string> => {
  try {
    const response = await fetch(CUSTOM_CHATBOT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symptoms: newUserMessage,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CustomChatbotResponse = await response.json();

    // Format the response in a user-friendly way
    let formattedResponse = `Based on your symptoms: "${data.input}"\n\n`;
    formattedResponse +=
      "Here are the possible conditions I've identified:\n\n";

    data.predictions.forEach((prediction, index) => {
      const confidencePercentage = (prediction.confidence * 100).toFixed(1);
      formattedResponse += `${index + 1}. **${
        prediction.condition
      }** (${confidencePercentage}% confidence)\n`;
      formattedResponse += `   Recommended specialist: ${prediction.specialty}\n\n`;
    });

    formattedResponse += "**General Recommendations:**\n";
    formattedResponse += "• Monitor your symptoms and note any changes\n";
    formattedResponse += "• Stay hydrated and get adequate rest\n";
    formattedResponse +=
      "• Seek immediate medical attention if symptoms worsen\n\n";

    formattedResponse +=
      "**Red Flag Symptoms - Seek immediate medical care if you experience:**\n";
    formattedResponse += "• Difficulty breathing or shortness of breath\n";
    formattedResponse += "• Chest pain or pressure\n";
    formattedResponse += "• High fever (above 103°F/39.4°C)\n";
    formattedResponse += "• Severe abdominal pain\n";
    formattedResponse += "• Signs of severe dehydration\n";
    formattedResponse += "• Loss of consciousness or confusion\n\n";

    formattedResponse +=
      "**Disclaimer:** This AI analysis is based on machine learning and is not a medical diagnosis. Please consult a healthcare provider for proper medical evaluation and treatment.";

    return formattedResponse;
  } catch (error) {
    console.error("Error calling custom chatbot API:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return "I'm sorry, the custom chatbot service is currently unavailable. Please make sure the backend server is running on localhost:5000, or try using the Gemini AI option instead.";
    }

    return "I'm sorry, I encountered an error while analyzing your symptoms. Please try again or use the Gemini AI option.";
  }
};
