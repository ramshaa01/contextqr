import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const stallIds = searchParams.get('ids')?.split(',') ?? [];

    const filePath = path.join(process.cwd(), 'data', 'stalls.json');
    const data = await fs.readFile(filePath, 'utf8');
    const stalls = JSON.parse(data);

    // If specific IDs requested, filter; otherwise return all
    const result = stallIds.length > 0
      ? stalls.filter(s => stallIds.includes(s.stallId))
      : stalls;

    return NextResponse.json(result);
  } catch (error) {
    console.error('Stalls API Error:', error);
    return NextResponse.json({ error: 'Failed to load stalls data' }, { status: 500 });
  }
}
