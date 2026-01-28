
import { GoogleGenAI, Type } from "@google/genai";

const MODEL_TEXT = 'gemini-3-flash-preview';
const MODEL_PRO = 'gemini-3-pro-preview';

/**
 * Professional AI Service with error handling and retry logic.
 */
async function callGemini(prompt: string, model: string = MODEL_TEXT, isJson: boolean = false) {
  const maxRetries = 2;
  let lastError: any;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const config: any = {};
      
      if (isJson) {
        config.responseMimeType = "application/json";
      }

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config
      });

      if (!response.text) throw new Error("Empty response from AI");
      return response.text;
    } catch (error: any) {
      lastError = error;
      if (error?.message?.includes('429')) {
        // Exponential backoff
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
        continue;
      }
      break;
    }
  }
  throw lastError;
}

export async function getAIDoubtResponse(question: string): Promise<string> {
  try {
    const prompt = `You are an expert tutor on StudyFlow Pro. A student has the following doubt: "${question}". 
    Provide a clear, educational, and encouraging response. Format the response in Markdown for better readability.`;
    return await callGemini(prompt);
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to the AI brain. Please try again in a moment.";
  }
}

export async function getTopicInsight(mistakes: string[]): Promise<string> {
  try {
    const prompt = `Analyze these learning gaps: ${mistakes.join(', ')}. 
    Provide a professional performance insight consisting of:
    1. A summary of the core misunderstanding.
    2. Three actionable study steps.
    3. A motivational closing.`;
    // Use Pro model for deeper reasoning
    return await callGemini(prompt, MODEL_PRO);
  } catch (error) {
    return "Keep focusing on your weaker topics to improve your overall score.";
  }
}
