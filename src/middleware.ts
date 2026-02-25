import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-me';
const AGENT_API_KEY = process.env.AGENT_API_KEY || '';
const COOKIE_NAME = 'vitals_session';

const PUBLIC_PATHS = ['/login', '/api/auth', '/favicon.ico'];

function verifyToken(token: string): boolean {
  const lastDot = token.lastIndexOf('.');
  if (lastDot === -1) return false;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

function verifyAgentKey(key: string): boolean {
  if (!AGENT_API_KEY) return false;
  try {
    return timingSafeEqual(Buffer.from(key), Buffer.from(AGENT_API_KEY));
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
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
  if (session && verifyToken(session)) {
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
