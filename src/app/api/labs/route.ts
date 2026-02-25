import { NextRequest, NextResponse } from 'next/server';
import { kvGet, kvSet } from '@/lib/kv';
import { isAgentRequest } from '@/lib/api-helpers';
import type { LabDraw } from '@/lib/types';

export async function GET(request: NextRequest) {
  const draws = await kvGet<LabDraw[]>('vitals:labs') ?? [];
  const { searchParams } = request.nextUrl;
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const marker = searchParams.get('marker');

  let filtered = draws;

  if (from) filtered = filtered.filter(d => d.date >= from);
  if (to) filtered = filtered.filter(d => d.date <= to);
  if (marker) {
    filtered = filtered.map(d => ({
      ...d,
      markers: d.markers.filter(m =>
        m.name.toLowerCase().includes(marker.toLowerCase())
      ),
    })).filter(d => d.markers.length > 0);
  }

  // Sort by date descending
  filtered.sort((a, b) => b.date.localeCompare(a.date));

  return NextResponse.json(filtered);
}

export async function POST(request: NextRequest) {
  if (!isAgentRequest(request)) {
    return NextResponse.json({ error: 'Agent key required' }, { status: 403 });
  }
  try {
    const draw: LabDraw = await request.json();
    const existing = await kvGet<LabDraw[]>('vitals:labs') ?? [];
    // Replace if same date exists, otherwise add
    const idx = existing.findIndex(d => d.date === draw.date);
    if (idx >= 0) {
      existing[idx] = draw;
    } else {
      existing.push(draw);
    }
    await kvSet('vitals:labs', existing);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
