import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromHeader } from '@/lib/auth';
import { runMigrations } from '@/lib/db';

export async function POST(request: NextRequest) {
  const auth = getAuthFromHeader(request.headers.get('authorization'));
  if (auth !== 'agent') {
    return NextResponse.json({ error: 'Agent key required' }, { status: 403 });
  }

  try {
    await runMigrations();
    return NextResponse.json({ ok: true, message: 'Migrations complete' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
