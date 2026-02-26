import { NextRequest, NextResponse } from 'next/server';
import { kvGet, kvSet, kvDel } from '@/lib/kv';
import { isAgentRequest } from '@/lib/api-helpers';
import type { MedicalRecord } from '@/lib/types';

const KV_KEY = 'vitals:records';

export async function GET(request: NextRequest) {
  try {
    const records = await kvGet<MedicalRecord[]>(KV_KEY) ?? [];
    if (!Array.isArray(records)) return NextResponse.json([]);
    records.sort((a, b) => (b.uploadedAt ?? '').localeCompare(a.uploadedAt ?? ''));
    return NextResponse.json(records);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAgentRequest(request)) {
    return NextResponse.json({ error: 'Agent key required' }, { status: 403 });
  }
  await kvSet(KV_KEY, []);
  return NextResponse.json({ ok: true, cleared: true });
}

export async function POST(request: NextRequest) {
  if (!isAgentRequest(request)) {
    return NextResponse.json({ error: 'Agent key required' }, { status: 403 });
  }
  try {
    const body = await request.json();
    // Handle wrapped format: {"records": [...]}
    const unwrapped = !Array.isArray(body) && body?.records && Array.isArray(body.records) ? body.records : body;
    const incoming: MedicalRecord[] = Array.isArray(unwrapped) ? unwrapped : [unwrapped];
    const raw = await kvGet<unknown[]>(KV_KEY) ?? [];
    // Filter existing to only valid records
    const existing = (Array.isArray(raw) ? raw : []).filter(
      (r): r is MedicalRecord => r != null && typeof r === 'object' && !Array.isArray(r) && typeof (r as Record<string, unknown>).filename === 'string'
    );

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
