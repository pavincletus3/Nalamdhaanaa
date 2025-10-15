import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, Medicine } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn(
    "API_KEY for Gemini is not set. Chat functionality will be disabled."
  );
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = `You are Nalamdhaanaa, a friendly and helpful AI health assistant. Your role is to interpret user-described symptoms and provide general guidance.
You are NOT a medical professional, and your advice does not substitute for a real doctor's consultation.
When a user describes symptoms, you should:
1.  Acknowledge and summarize the symptoms you've understood.
2.  Suggest a few possible, common medical conditions that might be associated with these symptoms. Present these as possibilities, not diagnoses. You can add a confidence score (e.g., "Possible cause (low confidence): ...").
3.  Provide general, safe, self-care advice (e.g., "rest," "stay hydrated").
4.  List "Red Flag" symptoms. These are critical symptoms that indicate the user should see a doctor immediately (e.g., "difficulty breathing," "chest pain," "high fever that doesn't go down").
5.  ALWAYS include a clear disclaimer at the end of every message: "Disclaimer: I am an AI assistant and not a medical professional. This information is for educational purposes only. Please consult a healthcare provider for any medical concerns or diagnosis."
Do not provide drug prescriptions or specific treatment plans. Keep your responses concise, easy to understand, and empathetic.
`;

export const getAiChatResponse = async (
  history: ChatMessage[],
  newUserMessage: string
): Promise<string> => {
  if (!API_KEY) {
    return "The AI chat feature is currently unavailable. Please ensure the API key is configured.";
  }

  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      })),
    });

    const result = await chat.sendMessage({ message: newUserMessage });

    return result.text;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "I'm sorry, I encountered an error and can't respond right now. Please try again later.";
  }
};

export const extractPrescriptionDetailsFromImage = async (
  mimeType: string,
  imageData: string
): Promise<{ medicines: Medicine[]; rawText: string }> => {
  if (!API_KEY) {
    throw new Error("API_KEY for Gemini is not set.");
  }

  const model = "gemini-2.5-flash";
  const prompt = `
    Analyze the following image of a medical prescription.
    Extract all medicine names, their dosages (e.g., "10mg", "500 units"), the frequency of intake (e.g., "1 per day", "twice daily"), and the duration (e.g., "30 days", "as needed").
    Also extract the full, raw text from the prescription.
    Return the extracted information in a JSON format. The JSON object should have two keys: "medicines" and "rawText".
    The "medicines" key should be an array of objects, where each object represents a medicine and has the following keys: "id", "name", "dosage", "frequency", "duration".
    The "rawText" key should contain the full transcribed text from the image.
    If any information for a field is not available, return an empty string for that field.
    For the 'id' field, generate a unique random string for each medicine.
  `;

  const imagePart = {
    inlineData: {
      mimeType,
      data: imageData,
    },
  };

  const textPart = {
    text: prompt,
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rawText: {
              type: Type.STRING,
              description:
                "The full transcribed text from the prescription image.",
            },
            medicines: {
              type: Type.ARRAY,
              description: "A list of all medicines found in the prescription.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: {
                    type: Type.STRING,
                    description: "A unique identifier for the medicine.",
                  },
                  name: {
                    type: Type.STRING,
                    description: "The name of the medicine.",
                  },
                  dosage: {
                    type: Type.STRING,
                    description: "The dosage of the medicine.",
                  },
                  frequency: {
                    type: Type.STRING,
                    description: "How often the medicine should be taken.",
                  },
                  duration: {
                    type: Type.STRING,
                    description: "For how long the medicine should be taken.",
                  },
                },
                required: ["id", "name", "dosage", "frequency", "duration"],
              },
            },
          },
          required: ["rawText", "medicines"],
        },
      },
    });

    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText);

    if (
      parsedResult &&
      Array.isArray(parsedResult.medicines) &&
      typeof parsedResult.rawText === "string"
    ) {
      parsedResult.medicines.forEach((med: Medicine) => {
        if (!med.id) {
          med.id = `med-${Date.now()}-${Math.random()}`;
        }
      });
      return parsedResult;
    } else {
      throw new Error(
        "Parsed JSON from Gemini does not match the expected schema."
      );
    }
  } catch (error) {
    console.error("Error processing prescription with Gemini:", error);
    throw new Error(
      "Failed to analyze the prescription image. The image might be unclear or the format is not supported."
    );
  }
};

export const verifyPrescriptionWithAI = async (
  medicines: Medicine[]
): Promise<{ warnings: string[] }> => {
  if (!API_KEY) {
    throw new Error("API_KEY for Gemini is not set.");
  }
  if (medicines.length === 0) {
    return { warnings: [] };
  }

  const model = "gemini-2.5-flash";
  const medicineList = medicines
    .map((m) => `- ${m.name} (${m.dosage})`)
    .join("\n");

  const prompt = `
    As a clinical pharmacist AI, analyze the following list of medications for potential issues.
    The list is:
    ${medicineList}

    Your tasks are:
    1. Identify any potential drug-drug interactions between these medications.
    2. Flag any dosages that seem unusually high or low for standard adult use.
    3. Consolidate your findings into a clear, concise list of warnings for the patient.

    Return the results in a JSON format. The JSON object should have one key: "warnings".
    The "warnings" key should be an array of strings, where each string is a specific warning.
    For example: "Potential interaction between [Drug A] and [Drug B]. Consult your doctor." or "The dosage for [Drug C] appears high. Please verify with your healthcare provider."

    If you find no issues, return an empty "warnings" array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            warnings: {
              type: Type.ARRAY,
              description:
                "A list of potential drug interactions or dosage issues.",
              items: {
                type: Type.STRING,
              },
            },
          },
          required: ["warnings"],
        },
      },
    });

    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText);

    if (parsedResult && Array.isArray(parsedResult.warnings)) {
      return parsedResult;
    } else {
      throw new Error(
        "Parsed JSON from Gemini does not match the expected schema for warnings."
      );
    }
  } catch (error) {
    console.error("Error verifying prescription with Gemini:", error);
    throw new Error(
      "Failed to analyze the prescription for interactions and dosage issues."
    );
  }
};
export const getMedicationInfo = async (
  medicationName: string
): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API key is not configured.");
  }
  if (!medicationName.trim()) {
    throw new Error("Medication name cannot be empty.");
  }

  try {
    const prompt = `
      Provide a brief, patient-friendly summary for the medication: "${medicationName}".
      The summary should be easy to understand for a non-medical person.
      Include the following sections:
      1.  **Common Uses:** What is it generally prescribed for?
      2.  **Important Note:** One single, most critical side effect or warning to be aware of.
      
      Keep the entire response under 100 words and format it as a single block of text, using markdown for bolding section titles.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching medication info from Gemini:", error);
    throw new Error(
      "Could not retrieve medication information. Please check the console for details."
    );
  }
};
