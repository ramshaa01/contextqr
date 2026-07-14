import { GoogleGenAI, Type } from '@google/genai';

// Initialize the client. We pass a dummy if missing to avoid breaking at import time,
// but we'll check it during the call.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy' });

/**
 * Shared wrapper for calling Gemini API with fallback and timeout logic.
 * @param {string} prompt - The user prompt or content
 * @param {Object} options - Configuration options
 * @returns {Promise<string>}
 */
export async function callGemini(prompt, options = {}) {
  const {
    timeoutMs = 3000,
    model = 'gemini-3-flash',
    systemInstruction = '',
    responseSchema = null,
    responseMimeType = 'text/plain',
  } = options;

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy') {
    throw new Error('GEMINI_API_KEY is not set. Falling back to rule-based logic.');
  }

  const config = {
    systemInstruction,
    responseMimeType,
  };

  if (responseSchema) {
    config.responseSchema = responseSchema;
  }

  const generatePromise = ai.models.generateContent({
    model: model,
    contents: prompt,
    config: config
  });

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Gemini API timeout after ${timeoutMs}ms`)), timeoutMs);
  });

  try {
    const response = await Promise.race([generatePromise, timeoutPromise]);
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error; // Let the caller catch and fallback
  }
}

// Export Type so other files can use it for schemas
export { Type };
