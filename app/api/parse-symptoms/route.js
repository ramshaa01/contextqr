import { NextResponse } from 'next/server';
import { callGemini, Type } from '@/lib/geminiClient';

export async function POST(request) {
  try {
    const { freeTextInput } = await request.json();

    if (!freeTextInput) {
      return NextResponse.json({ error: "Missing freeTextInput" }, { status: 400 });
    }

    const systemInstruction = `
      You are a medical symptom extraction assistant.
      Your job is to read free-text descriptions of how someone is feeling and extract the closest matching symptoms from a strict list of allowed tags.
      
      ALLOWED TAGS:
      - chest pain
      - breathing difficulty
      - unconscious
      - severe bleeding
      - dizziness
      - fever
      - allergic reaction
      - vomiting
      - minor cut
      - headache
      
      RULES:
      1. ONLY return tags from the ALLOWED TAGS list. Do not invent tags.
      2. If the user's text implies a tag (e.g., "my head hurts" -> "headache", "I'm throwing up" -> "vomiting"), map it.
      3. Return an array of matching strings. If no tags match, return an empty array.
    `;

    const schema = {
      type: Type.ARRAY,
      description: "List of extracted medical symptom tags",
      items: {
        type: Type.STRING,
      },
    };

    const result = await callGemini(freeTextInput, {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: schema,
      timeoutMs: 4000 // Give this one slightly more time as it's a direct user action
    });

    // Parse the result. Because we used responseMimeType: application/json, it should be a valid JSON string
    const parsedTags = JSON.parse(result);
    return NextResponse.json({ tags: parsedTags });

  } catch (error) {
    console.error("parse-symptoms API error:", error);
    // If Gemini fails, we degrade gracefully by returning an error, 
    // the UI will ask the user to use the manual checkboxes instead.
    return NextResponse.json({ error: "Failed to parse symptoms", details: error.message }, { status: 500 });
  }
}
