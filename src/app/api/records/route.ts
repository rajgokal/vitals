import { NextRequest, NextResponse } from 'next/server';
import { kvGet, kvSet } from '@/lib/kv';
import { isAgentRequest } from '@/lib/api-helpers';
import type { MedicalRecord } from '@/lib/types';

const KV_KEY = 'vitals:records';

export async function GET() {
  const records = await kvGet<MedicalRecord[]>(KV_KEY) ?? [];
  records.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  return NextResponse.json(records);
}

export async function POST(request: NextRequest) {
  if (!isAgentRequest(request)) {
    return NextResponse.json({ error: 'Agent key required' }, { status: 403 });
  }
  try {
    const body = await request.json();
    const incoming: MedicalRecord[] = Array.isArray(body) ? body : [body];
    const existing = await kvGet<MedicalRecord[]>(KV_KEY) ?? [];

    for (const record of incoming) {
      const idx = existing.findIndex(r => r.id === record.id);
      if (idx >= 0) {
        existing[idx] = record;
      } else {
        existing.push(record);
      }
    }

    await kvSet(KV_KEY, existing);
    return NextResponse.json({ ok: true, count: incoming.length });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
