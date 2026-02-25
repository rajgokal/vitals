import { NextRequest, NextResponse } from 'next/server';
import { kvGet, kvSet } from '@/lib/kv';
import { isAgentRequest } from '@/lib/api-helpers';
import type { Encounter } from '@/lib/types';

export async function GET() {
  const data = await kvGet<Encounter[]>('vitals:encounters');
  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  if (!isAgentRequest(request)) {
    return NextResponse.json({ error: 'Agent key required' }, { status: 403 });
  }
  try {
    const encounter: Encounter = await request.json();
    const existing = await kvGet<Encounter[]>('vitals:encounters') ?? [];
    existing.push(encounter);
    await kvSet('vitals:encounters', existing);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
