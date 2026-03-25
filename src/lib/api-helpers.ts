import { NextRequest, NextResponse } from 'next/server';
import { kvGet, kvSet, kvGetProfileData, kvSetProfileData, validateProfileId } from './kv';

export function isAgentRequest(request: NextRequest): boolean {
  return request.headers.get('x-auth-type') === 'agent';
}

export function getProfileIdFromRequest(request: NextRequest): string {
  // Check header first (primary method)
  const headerProfileId = request.headers.get('X-Profile-Id');
  if (headerProfileId) return headerProfileId;
  
  // Fallback to query param for backward compatibility
  const { searchParams } = request.nextUrl;
  return searchParams.get('profileId') || 'raj';
}

export async function validateRequestProfile(request: NextRequest): Promise<{ profileId: string; isValid: boolean }> {
  const profileId = getProfileIdFromRequest(request);
  const isValid = await validateProfileId(profileId);
  return { profileId, isValid };
}

// Legacy handlers (for backward compatibility)
export function createGetHandler(key: string) {
  return async function GET() {
    const data = await kvGet(key);
    return NextResponse.json(data ?? null);
  };
}

export function createPostHandler(key: string, opts?: { agentOnly?: boolean }) {
  return async function POST(request: NextRequest) {
    if (opts?.agentOnly && !isAgentRequest(request)) {
      return NextResponse.json({ error: 'Agent key required' }, { status: 403 });
    }
    try {
      const body = await request.json();
      await kvSet(key, body);
      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }
  };
}

// Profile-aware handlers
export function createProfileGetHandler(dataType: string) {
  return async function GET(request: NextRequest) {
    const { profileId, isValid } = await validateRequestProfile(request);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid profile ID' }, { status: 400 });
    }
    
    let data = await kvGetProfileData(dataType, profileId);
    
    // Handle legacy JSON string data (from migration)
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch {
        // If parsing fails, treat as null
        data = null;
      }
    }
    
    return NextResponse.json(data ?? null);
  };
}

export function createProfilePostHandler(dataType: string, opts?: { agentOnly?: boolean }) {
  return async function POST(request: NextRequest) {
    if (opts?.agentOnly && !isAgentRequest(request)) {
      return NextResponse.json({ error: 'Agent key required' }, { status: 403 });
    }
    
    const { profileId, isValid } = await validateRequestProfile(request);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid profile ID' }, { status: 400 });
    }
    
    try {
      const body = await request.json();
      await kvSetProfileData(dataType, profileId, body);
      return NextResponse.json({ ok: true, profileId });
    } catch {
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }
  };
}
