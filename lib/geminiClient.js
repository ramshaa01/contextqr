import { GoogleGenAI, Type } from '@google/genai';

// Initialize the client. We pass a dummy if missing to avoid breaking at import time,
// but we'll check it during the call.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy' });

/**
 * callGemini — Shared wrapper for all Gemini API calls.
 *
 * Enforces a hard timeout (default 3s) so a slow or unavailable API never
 * blocks the user-facing response. All callers must handle the thrown error
 * and degrade gracefully to rule-based output.
 *
 * @param {string} prompt              The user prompt or content to send
 * @param {Object} options             Configuration overrides
 * @param {number} options.timeoutMs   Hard timeout in milliseconds (default: 3000)
 * @param {string} options.model       Gemini model name (default: 'gemini-3-flash')
 * @param {string} options.systemInstruction  Role/persona instruction for the model
 * @param {Object|null} options.responseSchema  JSON schema for structured output
 * @param {string} options.responseMimeType     'text/plain' or 'application/json'
 * @returns {Promise<string>}          The raw text response from Gemini
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
    model,    // shorthand for model: model
    contents: prompt,
    config,   // shorthand for config: config
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
