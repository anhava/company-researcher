import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { businessId } = await req.json();

    if (!businessId) {
      return NextResponse.json({ error: 'Y-tunnus on pakollinen' }, { status: 400 });
    }

    // Suomi.fi open data endpoint
    const suomifiUrl = `https://api.suomi.fi/organization/v4/organizations/${businessId}`;

    const response = await fetch(suomifiUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Suomi.fi API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ results: data });
    
  } catch (error: any) {
    console.error('Suomi.fi API error:', error);
    return NextResponse.json({ error: `Suomi.fi API error: ${error.message}` }, { status: 500 });
  }
}