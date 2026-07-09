import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fromZone = searchParams.get('fromZone');
    const toZone = searchParams.get('toZone');

    if (!fromZone || !toZone) {
      return NextResponse.json({ error: 'fromZone and toZone query parameters are required' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'data', 'accessibilityRoutes.json');
    const data = await fs.readFile(filePath, 'utf8');
    const routes = JSON.parse(data);

    const route = routes.find(r => r.fromZone === fromZone && r.toZone === toZone && r.wheelchairAccessible);

    if (!route) {
      return NextResponse.json({ error: 'No accessible route found between these zones' }, { status: 404 });
    }

    return NextResponse.json(route);
  } catch (error) {
    console.error('Accessibility Route API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
