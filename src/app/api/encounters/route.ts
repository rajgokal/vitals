import { NextRequest, NextResponse } from 'next/server';
import { kvGetProfileData, kvSetProfileData } from '@/lib/kv';
import { isAgentRequest, validateRequestProfile } from '@/lib/api-helpers';
import type { Encounter } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { profileId, isValid } = await validateRequestProfile(request);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid profile ID' }, { status: 400 });
  }

  const rawEncounters = await kvGetProfileData<unknown>('encounters', profileId);
  
  // Ensure encounters is an array - handle corrupted data
  let encountersArray: unknown[];
  if (Array.isArray(rawEncounters)) {
    encountersArray = rawEncounters;
  } else if (rawEncounters != null && typeof rawEncounters === 'object') {
    // Single object stored instead of array - wrap it
    encountersArray = [rawEncounters];
  } else {
    encountersArray = [];
  }
  
  // Filter out corrupted entries (must have date, provider, type, and summary)
  const encounters = encountersArray.filter(
    (e): e is Encounter =>
      e != null && typeof e === 'object' && !Array.isArray(e) &&
      typeof (e as Record<string, unknown>).date === 'string' &&
      typeof (e as Record<string, unknown>).provider === 'string' &&
      typeof (e as Record<string, unknown>).type === 'string' &&
      typeof (e as Record<string, unknown>).summary === 'string'
  );
  
  const { searchParams } = request.nextUrl;
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const provider = searchParams.get('provider');

  let filtered = encounters;

  if (from) filtered = filtered.filter(e => e.date >= from);
  if (to) filtered = filtered.filter(e => e.date <= to);
  if (provider) {
    filtered = filtered.filter(e =>
      e.provider.toLowerCase().includes(provider.toLowerCase())
    );
  }

  // Sort by date descending
  filtered.sort((a, b) => b.date.localeCompare(a.date));

  return NextResponse.json(filtered);
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
    const encounter: Encounter = await request.json();
    if (!encounter.date || !encounter.provider || !encounter.type || !encounter.summary) {
      return NextResponse.json({ 
        error: 'date, provider, type, and summary required' 
      }, { status: 400 });
    }
    
    const rawExisting = await kvGetProfileData<unknown>('encounters', profileId);
    
    // Ensure existing is an array - handle corrupted data
    let existing: Encounter[];
    if (Array.isArray(rawExisting)) {
      existing = rawExisting.filter(
        (e): e is Encounter =>
          e != null && typeof e === 'object' && !Array.isArray(e) &&
          typeof (e as Record<string, unknown>).date === 'string' &&
          typeof (e as Record<string, unknown>).provider === 'string' &&
          typeof (e as Record<string, unknown>).type === 'string' &&
          typeof (e as Record<string, unknown>).summary === 'string'
      );
    } else if (rawExisting != null && typeof rawExisting === 'object') {
      // Single object stored - check if it's valid, then wrap it
      if (
        typeof (rawExisting as Record<string, unknown>).date === 'string' &&
        typeof (rawExisting as Record<string, unknown>).provider === 'string' &&
        typeof (rawExisting as Record<string, unknown>).type === 'string' &&
        typeof (rawExisting as Record<string, unknown>).summary === 'string'
      ) {
        existing = [rawExisting as Encounter];
      } else {
        existing = [];
      }
    } else {
      existing = [];
    }
    
    // Replace if same date and provider exists, otherwise add
    const idx = existing.findIndex(e => e.date === encounter.date && e.provider === encounter.provider);
    if (idx >= 0) {
      existing[idx] = encounter;
    } else {
      existing.push(encounter);
    }
    
    await kvSetProfileData('encounters', profileId, existing);
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
    const { date, provider, updates } = await request.json() as { 
      date: string; 
      provider: string; 
      updates: Partial<Encounter> 
    };
    if (!date || !provider) {
      return NextResponse.json({ error: 'date and provider required' }, { status: 400 });
    }
    
    const rawExisting = await kvGetProfileData<unknown>('encounters', profileId);
    
    // Ensure existing is an array
    let existing: Encounter[];
    if (Array.isArray(rawExisting)) {
      existing = rawExisting.filter(
        (e): e is Encounter =>
          e != null && typeof e === 'object' && !Array.isArray(e) &&
          typeof (e as Record<string, unknown>).date === 'string' &&
          typeof (e as Record<string, unknown>).provider === 'string' &&
          typeof (e as Record<string, unknown>).type === 'string' &&
          typeof (e as Record<string, unknown>).summary === 'string'
      );
    } else if (rawExisting != null && typeof rawExisting === 'object') {
      if (
        typeof (rawExisting as Record<string, unknown>).date === 'string' &&
        typeof (rawExisting as Record<string, unknown>).provider === 'string' &&
        typeof (rawExisting as Record<string, unknown>).type === 'string' &&
        typeof (rawExisting as Record<string, unknown>).summary === 'string'
      ) {
        existing = [rawExisting as Encounter];
      } else {
        existing = [];
      }
    } else {
      existing = [];
    }
    
    const idx = existing.findIndex(e => e.date === date && e.provider === provider);
    if (idx < 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    existing[idx] = { ...existing[idx], ...updates, date, provider };
    await kvSetProfileData('encounters', profileId, existing);
    return NextResponse.json({ ok: true, encounter: existing[idx], profileId });
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
    const { date, provider } = await request.json() as { date: string; provider: string };
    if (!date || !provider) {
      return NextResponse.json({ error: 'date and provider required' }, { status: 400 });
    }
    
    const rawExisting = await kvGetProfileData<unknown>('encounters', profileId);
    
    // Ensure existing is an array
    let existing: Encounter[];
    if (Array.isArray(rawExisting)) {
      existing = rawExisting.filter(
        (e): e is Encounter =>
          e != null && typeof e === 'object' && !Array.isArray(e) &&
          typeof (e as Record<string, unknown>).date === 'string' &&
          typeof (e as Record<string, unknown>).provider === 'string' &&
          typeof (e as Record<string, unknown>).type === 'string' &&
          typeof (e as Record<string, unknown>).summary === 'string'
      );
    } else if (rawExisting != null && typeof rawExisting === 'object') {
      if (
        typeof (rawExisting as Record<string, unknown>).date === 'string' &&
        typeof (rawExisting as Record<string, unknown>).provider === 'string' &&
        typeof (rawExisting as Record<string, unknown>).type === 'string' &&
        typeof (rawExisting as Record<string, unknown>).summary === 'string'
      ) {
        existing = [rawExisting as Encounter];
      } else {
        existing = [];
      }
    } else {
      existing = [];
    }
    
    const filtered = existing.filter(e => !(e.date === date && e.provider === provider));
    if (filtered.length === existing.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    await kvSetProfileData('encounters', profileId, filtered);
    return NextResponse.json({ ok: true, removed: existing.length - filtered.length, profileId });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}