import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    deployed: true, 
    timestamp: new Date().toISOString(),
    version: 'data-parsing-fix-v1'
  });
}