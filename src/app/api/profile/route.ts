import { NextRequest, NextResponse } from 'next/server';
import { kvGetProfileData, kvSetProfileData, getProfileRegistry } from '@/lib/kv';
import { isAgentRequest, getProfileIdFromRequest, validateRequestProfile } from '@/lib/api-helpers';
import type { Profile } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { profileId, isValid } = await validateRequestProfile(request);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid profile ID' }, { status: 400 });
  }

  // First try to get from profile data
  let profile = await kvGetProfileData<Profile>('profile', profileId);
  
  // If not found, get from profile registry
  if (!profile) {
    const registry = await getProfileRegistry();
    profile = registry.profiles.find(p => p.id === profileId) || null;
  }

  return NextResponse.json(profile);
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
    const profileData = {
      ...body,
      id: profileId,
      updatedAt: new Date().toISOString(),
    };
    
    await kvSetProfileData('profile', profileId, profileData);
    return NextResponse.json({ ok: true, profileId });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
