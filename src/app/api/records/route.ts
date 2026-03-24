import { NextRequest, NextResponse } from 'next/server';
import { kvGetProfileData, kvSetProfileData } from '@/lib/kv';
import { isAgentRequest, validateRequestProfile } from '@/lib/api-helpers';
import type { MedicalRecord } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { profileId, isValid } = await validateRequestProfile(request);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid profile ID' }, { status: 400 });
  }

  try {
    const records = await kvGetProfileData<MedicalRecord[]>('records', profileId) ?? [];
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

  const { profileId, isValid } = await validateRequestProfile(request);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid profile ID' }, { status: 400 });
  }

  await kvSetProfileData('records', profileId, []);
  return NextResponse.json({ ok: true, cleared: true, profileId });
}

export async function POST(request: NextRequest) {
  if (!isAgentRequest(request)) {
    return NextResponse.json({ error: 'Agent key required' }, { status: 403 });
  }

  const { profileId, isValid } = await validateRequestProfile(request);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid profile ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    // Handle wrapped format: {"records": [...]}
    const unwrapped = !Array.isArray(body) && body?.records && Array.isArray(body.records) ? body.records : body;
    const incoming: MedicalRecord[] = Array.isArray(unwrapped) ? unwrapped : [unwrapped];
    const raw = await kvGetProfileData<unknown[]>('records', profileId) ?? [];
    // Filter existing to only valid record objects (must have id)
    const existing = (Array.isArray(raw) ? raw : []).filter(
      (r): r is MedicalRecord => r != null && typeof r === 'object' && !Array.isArray(r) && typeof (r as Record<string, unknown>).id === 'string'
    );

    for (const record of incoming) {
      const idx = existing.findIndex(r => r.id === record.id);
      if (idx >= 0) {
        existing[idx] = record;
      } else {
        existing.push(record);
      }
    }

    await kvSetProfileData('records', profileId, existing);
    return NextResponse.json({ ok: true, count: incoming.length, stored: existing.length, profileId });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
