import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GenderData } from "../types";

const processEnvApiKey = process.env.API_KEY;

// Define the response schema for strict JSON output
const genderCountSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    male: {
      type: Type.INTEGER,
      description: "Count of male/nam entities identified in the text.",
    },
    female: {
      type: Type.INTEGER,
      description: "Count of female/nữ entities identified in the text.",
    },
    unknown: {
      type: Type.INTEGER,
      description: "Count of items that are likely people but gender is ambiguous, or other items.",
    },
  },
  required: ["male", "female", "unknown"],
};

export const analyzeWithGemini = async (text: string): Promise<GenderData> => {
  if (!processEnvApiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: processEnvApiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Analyze the following text list and count the number of males (Nam) and females (Nữ).
        
        Rules:
        1. Identify common Vietnamese gender terms: "Nam" (Male), "Nữ" (Female).
        2. Handle mixed case (nam, NAM, Nu, nu), typos, or extra punctuation.
        3. If a line implies gender (e.g., "Anh ấy", "Cô ấy"), count it appropriately.
        4. Return the raw counts.

        Input Text:
        """
        ${text}
        """
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: genderCountSchema,
        systemInstruction: "You are a precise data analyst specialized in Vietnamese demographic data processing.",
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini.");
    }

    const parsed = JSON.parse(resultText);
    
    return {
      male: parsed.male || 0,
      female: parsed.female || 0,
      unknown: parsed.unknown || 0,
      total: (parsed.male || 0) + (parsed.female || 0) + (parsed.unknown || 0),
    };

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw error;
  }
};