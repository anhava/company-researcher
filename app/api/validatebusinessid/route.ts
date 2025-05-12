import { NextRequest, NextResponse } from 'next/server';
import { FinnishBusinessIds } from 'finnish-business-ids';

export async function POST(req: NextRequest) {
  try {
    const { businessId } = await req.json();

    if (!businessId) {
      return NextResponse.json({ error: 'Y-tunnus on pakollinen' }, { status: 400 });
    }

    // Validate Finnish business ID
    const isValid = FinnishBusinessIds.isValidBusinessId(businessId);
    
    return NextResponse.json({ 
      isValid,
      formattedId: isValid ? FinnishBusinessIds.formatBusinessId(businessId) : null
    });

  } catch (error: any) {
    console.error('Business ID validation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}