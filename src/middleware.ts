import { NextRequest, NextResponse } from 'next/server';

const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-me';
const AGENT_API_KEY = process.env.AGENT_API_KEY || '';
const COOKIE_NAME = 'vitals_session';

const PUBLIC_PATHS = ['/login', '/api/auth'];

async function hmacSign(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(SESSION_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyToken(token: string): Promise<boolean> {
  const lastDot = token.lastIndexOf('.');
  if (lastDot === -1) return false;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = await hmacSign(payload);
  return sig === expected;
}

function verifyAgentKey(key: string): boolean {
  if (!AGENT_API_KEY || key.length !== AGENT_API_KEY.length) return false;
  // Constant-time comparison
  let result = 0;
  for (let i = 0; i < key.length; i++) {
    result |= key.charCodeAt(i) ^ AGENT_API_KEY.charCodeAt(i);
  }
  return result === 0;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Static assets
  if (pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Agent API key (for API routes)
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const key = authHeader.slice(7);
    if (verifyAgentKey(key)) {
      const response = NextResponse.next();
      response.headers.set('x-auth-type', 'agent');
      return response;
    }
  }

  // Session cookie
  const session = request.cookies.get(COOKIE_NAME)?.value;
  if (session && await verifyToken(session)) {
    return NextResponse.next();
  }

  // API routes get 401
  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Redirect to login
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
