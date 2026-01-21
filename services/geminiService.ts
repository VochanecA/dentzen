
import { GoogleGenAI, Type } from "@google/genai";

export const getReassurance = async (fear: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User has a dental fear: "${fear}". Provide a comforting, medically accurate, but gentle explanation to reduce anxiety. Keep it under 100 words. Speak directly to the patient.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "You are in good hands. Modern dentistry focuses on your comfort and safety.";
  }
};

export const getDentistInsights = async (anxietyHistory: any[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on this patient's anxiety history: ${JSON.stringify(anxietyHistory)}, provide a 3-bullet point summary for a dentist on how to best communicate with this patient during their next visit. Focus on sedation needs or communication style.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Be gentle and explain every step before proceeding.";
  }
};
