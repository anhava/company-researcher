import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { businessId } = await req.json();

    if (!businessId) {
      return NextResponse.json({ error: 'Y-tunnus on pakollinen' }, { status: 400 });
    }

    // PRH Open Data API endpoint
    const prhUrl = `https://avoindata.prh.fi/bis/v1/${businessId}`;

    const response = await fetch(prhUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`PRH API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ results: data });
    
  } catch (error: any) {
    console.error('PRH API error:', error);
    return NextResponse.json({ error: `PRH API error: ${error.message}` }, { status: 500 });
  }
}