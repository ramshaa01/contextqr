import { NextResponse } from 'next/server';
import { callGemini, Type } from '@/lib/geminiClient';

export async function POST(request) {
  try {
    const { primary, secondary = [], timeContext, zoneType } = await request.json();

    if (!primary) {
      return NextResponse.json({ error: "Missing primary action" }, { status: 400 });
    }

    const systemInstruction = `
      You are ContextQR, a friendly, helpful, and concise stadium assistant.
      Your task is to rewrite the provided 'primary' action and 'secondary' tips into a single, warm, conversational response (1-2 sentences maximum).
      
      RULES:
      1. DO NOT invent or hallucinate any facts, numbers, queue times, or locations.
      2. ONLY use the information provided in the input.
      3. Keep it brief and welcoming.
      4. Do not include markdown formatting or quotes.
      
      Example Input:
      Primary: "Half-time! Stalls and toilets are nearby."
      Secondary: ["Nearest stalls: Burger Station, Drink Stand"]
      Context: half-time at seat
      
      Example Output:
      "It's half-time! Feel free to grab a bite at the nearby Burger Station or Drink Stand while you stretch your legs."
    `;

    const prompt = `
      Primary Action: ${primary}
      Secondary Info: ${secondary.join('. ')}
      Context: ${timeContext} at ${zoneType}
    `;

    const result = await callGemini(prompt, {
      systemInstruction,
      timeoutMs: 3000, // Strict 3 second timeout for quick QR scan UX
    });

    return NextResponse.json({ text: result.trim() });

  } catch (error) {
    console.error("generate-response API error:", error);
    // If Gemini fails or times out, we'll let the client handle the fallback
    // The client should gracefully display the original hardcoded 'primary' string
    return NextResponse.json({ error: "Failed to generate response", details: error.message }, { status: 500 });
  }
}
