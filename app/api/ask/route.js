import { NextResponse } from 'next/server';
import { callGemini } from '@/lib/geminiClient';
import { runDecisionEngine } from '@/lib/decisionEngine';

export async function POST(request) {
  try {
    const { userQuery, currentContext } = await request.json();

    if (!userQuery) {
      return NextResponse.json({ error: "Missing userQuery" }, { status: 400 });
    }

    // We can also actively fetch context if needed, but currentContext from frontend is usually enough
    // We'll stringify the context to pass to Gemini
    const contextString = JSON.stringify(currentContext || {});

    const systemInstruction = `
      You are ContextQR, an AI assistant for the Smart Stadium 2026 Smart Stadiums initiative.
      The user is asking a question from a specific zone in the stadium.
      
      Here is the user's exact current context data (including zone, time phase, nearby stalls, crowd density, and pre-computed guidance):
      ${contextString}
      
      RULES:
      1. If the user asks about something covered in the context (like "where is the nearest bathroom?", "how crowded is it?", "can I get food?"), answer using ONLY the data provided in the context JSON.
      2. If the user asks about medical help and it's not a medical post, direct them to use the emergency button or find staff.
      3. If the user asks a general question (e.g., "what time does the match end?", "how do I play football?"), provide a brief helpful answer but you MUST include this exact disclaimer at the end: "(Note: This is general guidance, not official stadium information)."
      4. DO NOT invent wait times, queue lengths, or specific locations if they are not in the context.
      5. Keep answers to 2-3 sentences max.
    `;

    const result = await callGemini(userQuery, {
      systemInstruction,
      timeoutMs: 5000 // Give conversational Q&A a slightly longer timeout
    });

    return NextResponse.json({ text: result.trim() });

  } catch (error) {
    console.error("ask API error:", error);
    return NextResponse.json({ 
      error: "Failed to process query", 
      text: "I'm sorry, I'm having trouble connecting to the stadium network right now. Please ask a member of staff for assistance."
    }, { status: 500 });
  }
}
