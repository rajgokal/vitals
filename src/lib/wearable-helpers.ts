import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromHeader, getSession } from '@/lib/auth';

export function isAgentAuth(request: NextRequest): boolean {
  return getAuthFromHeader(request.headers.get('authorization')) === 'agent';
}

export async function requireAuth(request: NextRequest): Promise<'agent' | 'session' | null> {
  const agentAuth = getAuthFromHeader(request.headers.get('authorization'));
  if (agentAuth === 'agent') return 'agent';
  const session = await getSession();
  if (session) return 'session';
  return null;
}

export function getPagination(url: URL): { limit: number; offset: number } {
  const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '30', 10) || 30, 1), 100);
  const page = Math.max(parseInt(url.searchParams.get('page') || '1', 10) || 1, 1);
  return { limit, offset: (page - 1) * limit };
}

export function getDateRange(url: URL): { from: string | null; to: string | null } {
  return {
    from: url.searchParams.get('from'),
    to: url.searchParams.get('to'),
  };
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: 'Agent key required' }, { status: 403 });
}
