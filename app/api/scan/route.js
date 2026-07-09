import { NextResponse } from 'next/server';
import { runDecisionEngine } from '@/lib/decisionEngine';

export async function POST(request) {
  try {
    const body = await request.json();
    const { zoneId, zoneType, timeContext, userProfile } = body;

    // We can allow zoneType to be explicitly passed or inferred.
    const response = await runDecisionEngine({
      zoneId,
      zoneType,
      timeContext,
      userProfile,
    });

    if (response.error) {
      return NextResponse.json({ error: response.message }, { status: 400 });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Scan API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
