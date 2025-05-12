import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { businessId } = await req.json();

    if (!businessId) {
      return NextResponse.json({ error: 'Y-tunnus on pakollinen' }, { status: 400 });
    }

    // Tilastokeskus API endpoint
    const tilastokeskusUrl = `https://pxdata.stat.fi/PxWeb/api/v1/fi/Yritykset/${businessId}`;

    const response = await fetch(tilastokeskusUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Tilastokeskus API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ results: data });
    
  } catch (error: any) {
    console.error('Tilastokeskus API error:', error);
    return NextResponse.json({ error: `Tilastokeskus API error: ${error.message}` }, { status: 500 });
  }
}