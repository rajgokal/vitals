import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-me';
const PASSWORD = process.env.NEROVIEW_PASSWORD || '';
const AGENT_API_KEY = process.env.AGENT_API_KEY || '';
const COOKIE_NAME = 'vitals_session';

function sign(payload: string): string {
  return createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
}

export function verifyPassword(input: string): boolean {
  if (!PASSWORD) {
    console.error('NEROVIEW_PASSWORD environment variable not set');
    return false;
  }
  const a = Buffer.from(input);
  const b = Buffer.from(PASSWORD);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function verifyAgentKey(key: string): boolean {
  if (!AGENT_API_KEY) return false;
  const a = Buffer.from(key);
  const b = Buffer.from(AGENT_API_KEY);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function createSessionToken(): string {
  const payload = `session:${Date.now()}`;
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string): boolean {
  const lastDot = token.lastIndexOf('.');
  if (lastDot === -1) return false;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = sign(payload);
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function getSession(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

export function getAuthFromHeader(authHeader: string | null): 'session' | 'agent' | null {
  if (!authHeader) return null;
  if (authHeader.startsWith('Bearer ')) {
    const key = authHeader.slice(7);
    if (verifyAgentKey(key)) return 'agent';
  }
  return null;
}

export { COOKIE_NAME };
