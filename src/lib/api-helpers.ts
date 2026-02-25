import { NextRequest, NextResponse } from 'next/server';
import { kvGet, kvSet } from './kv';

export function isAgentRequest(request: NextRequest): boolean {
  return request.headers.get('x-auth-type') === 'agent';
}

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
