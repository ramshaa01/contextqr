import { NextResponse } from 'next/server';
import { runTriage } from '@/lib/triageEngine';

export async function POST(request) {
  try {
    const body = await request.json();
    const { symptoms } = body;

    if (!symptoms || !Array.isArray(symptoms)) {
      return NextResponse.json({ error: 'Symptoms array is required' }, { status: 400 });
    }

    const triageResult = runTriage(symptoms);
    
    // In a real app we might also find the nearest medic from medicalPosts.json 
    // based on zoneId if it was passed. For now, we'll just return the logic outcome.

    return NextResponse.json(triageResult);
  } catch (error) {
    console.error('Triage API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
