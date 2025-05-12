import { NextRequest, NextResponse } from 'next/server';
import Exa from "exa-js";

export const maxDuration = 60;

const exa = new Exa(process.env.EXA_API_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const { businessId } = await req.json();

    if (!businessId) {
      return NextResponse.json({ error: 'Y-tunnus on pakollinen' }, { status: 400 });
    }

    // Use Exa to search for Business Finland funding information
    const result = await exa.searchAndContents(
      `${businessId} Business Finland rahoitus`,
      {
        type: "keyword",
        text: true,
        livecrawl: "always",
        summary: {
          query: "Kerro kaikki Business Finland rahoituksesta tälle yritykselle. Jos rahoitustietoja ei löydy, vastaa vain 'EI TIETOJA'."
        },
        includeText: [businessId],
        includeDomains: ["businessfinland.fi"]
      }
    );

    return NextResponse.json({ results: result.results });
    
  } catch (error: any) {
    console.error('Business Finland API error:', error);
    return NextResponse.json({ error: `Business Finland API error: ${error.message}` }, { status: 500 });
  }
}