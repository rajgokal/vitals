import { NextRequest, NextResponse } from 'next/server';
import { kvGetProfileData } from '@/lib/kv';
import { validateRequestProfile } from '@/lib/api-helpers';
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  const { profileId, isValid } = await validateRequestProfile(request);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid profile ID' }, { status: 400 });
  }

  const { date } = await params;
  const [draws, providers] = await Promise.all([
    kvGetProfileData<LabDraw[]>('labs', profileId).then(d => d ?? []),
    kvGetProfileData<Provider[]>('providers', profileId).then(p => p ?? []),
  ]);
  const draw = draws.find(d => d.date === date);
  if (!draw) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({
    ...draw,
    orderedBy: resolveOrderingProvider(draw.orderedBy, providers) ?? draw.orderedBy,
  });
}
