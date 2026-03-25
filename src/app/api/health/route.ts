import { NextResponse } from 'next/server';

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      has_session_secret: !!process.env.SESSION_SECRET,
      has_password: !!process.env.NEROVIEW_PASSWORD,
      has_agent_key: !!process.env.AGENT_API_KEY,
      has_kv_url: !!process.env.KV_REST_API_URL,
      has_kv_token: !!process.env.KV_REST_API_TOKEN,
    }
  };

  return NextResponse.json(health);
}