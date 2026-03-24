import { NextRequest, NextResponse } from 'next/server';
import { kvGetProfileData, kvSetProfileData } from '@/lib/kv';
import { isAgentRequest, validateRequestProfile } from '@/lib/api-helpers';
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
  const { profileId, isValid } = await validateRequestProfile(request);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid profile ID' }, { status: 400 });
  }

  const [rawDraws, providers] = await Promise.all([
    kvGetProfileData<unknown[]>('labs', profileId).then(d => d ?? []),
    kvGetProfileData<Provider[]>('providers', profileId).then(p => p ?? []),
  ]);
  // Filter out corrupted entries (must have string date + markers array)
  const draws = rawDraws.filter(
    (d): d is LabDraw =>
      d != null && typeof d === 'object' && !Array.isArray(d) &&
      typeof (d as Record<string, unknown>).date === 'string' &&
      Array.isArray((d as Record<string, unknown>).markers)
  );
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

  const { profileId, isValid } = await validateRequestProfile(request);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid profile ID' }, { status: 400 });
  }

  try {
    const draw: LabDraw = await request.json();
    if (!draw.date || !draw.markers) {
      return NextResponse.json({ error: 'date and markers required' }, { status: 400 });
    }
    
    const existing = await kvGetProfileData<LabDraw[]>('labs', profileId) ?? [];
    // Replace if same date exists, otherwise add
    const idx = existing.findIndex(d => d.date === draw.date);
    if (idx >= 0) {
      existing[idx] = draw;
    } else {
      existing.push(draw);
    }
    
    await kvSetProfileData('labs', profileId, existing);
    return NextResponse.json({ ok: true, profileId });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAgentRequest(request)) {
    return NextResponse.json({ error: 'Agent key required' }, { status: 403 });
  }

  const { profileId, isValid } = await validateRequestProfile(request);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid profile ID' }, { status: 400 });
  }

  try {
    const { date, updates } = await request.json() as { date: string; updates: Partial<LabDraw> };
    if (!date) {
      return NextResponse.json({ error: 'date required' }, { status: 400 });
    }
    
    const existing = await kvGetProfileData<LabDraw[]>('labs', profileId) ?? [];
    const idx = existing.findIndex(d => d.date === date);
    if (idx < 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    existing[idx] = { ...existing[idx], ...updates, date };
    await kvSetProfileData('labs', profileId, existing);
    return NextResponse.json({ ok: true, draw: existing[idx], profileId });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
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

  try {
    const { date } = await request.json() as { date: string };
    if (!date) {
      return NextResponse.json({ error: 'date required' }, { status: 400 });
    }
    
    const existing = await kvGetProfileData<LabDraw[]>('labs', profileId) ?? [];
    const filtered = existing.filter(d => d.date !== date);
    if (filtered.length === existing.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    await kvSetProfileData('labs', profileId, filtered);
    return NextResponse.json({ ok: true, removed: existing.length - filtered.length, profileId });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
