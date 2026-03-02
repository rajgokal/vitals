import { NextRequest, NextResponse } from 'next/server';
import { kvGet, kvSet } from '@/lib/kv';
import { isAgentRequest } from '@/lib/api-helpers';
import type { LabDraw, Provider } from '@/lib/types';

function resolveOrderingProvider(
  orderedBy: string | undefined,
  providers: Provider[],
): string | undefined {
  if (!orderedBy) return undefined;
  const match = providers.find(p =>
    orderedBy.toLowerCase().includes(p.name.toLowerCase().replace(/^dr\.?\s*/i, '')) ||
    p.name.toLowerCase().includes(orderedBy.toLowerCase().replace(/,?\s*md$/i, '').replace(/^dr\.?\s*/i, ''))
  );
  if (match?.practice) return match.practice;
  return orderedBy;
}

export async function GET(request: NextRequest) {
  const [draws, providers] = await Promise.all([
    kvGet<LabDraw[]>('vitals:labs').then(d => d ?? []),
    kvGet<Provider[]>('vitals:providers').then(p => p ?? []),
  ]);
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

  // Enrich with resolved provider practice names
  const enriched = filtered.map(d => ({
    ...d,
    orderedBy: resolveOrderingProvider(d.orderedBy, providers) ?? d.orderedBy,
  }));

  return NextResponse.json(enriched);
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
