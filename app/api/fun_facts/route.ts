import { NextResponse } from 'next/server';
import { getAllFunFacts } from '@/lib/fun_facts';

export async function GET() {
  try {
    const funFacts = await getAllFunFacts();
    return NextResponse.json(funFacts);
  } catch (error) {
    console.error('Error in fun facts API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fun facts' },
      { status: 500 }
    );
  }
}


