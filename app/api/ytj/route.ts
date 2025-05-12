import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { businessId } = await req.json();

    if (!businessId) {
      return NextResponse.json({ error: 'Y-tunnus on pakollinen' }, { status: 400 });
    }

    // YTJ API endpoint
    const ytjUrl = `https://tietopalvelu.ytj.fi/api/v1/companies/${businessId}`;

    const response = await fetch(ytjUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`YTJ API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ results: data });
    
  } catch (error: any) {
    console.error('YTJ API error:', error);
    return NextResponse.json({ error: `YTJ API error: ${error.message}` }, { status: 500 });
  }
}