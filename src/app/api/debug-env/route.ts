import { NextResponse } from 'next/server';

export async function GET() {
  // Only expose this in development or with a specific debug key
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    SESSION_SECRET_SET: !!process.env.SESSION_SECRET,
    NEROVIEW_PASSWORD_SET: !!process.env.NEROVIEW_PASSWORD,
    AGENT_API_KEY_SET: !!process.env.AGENT_API_KEY,
    KV_REST_API_URL_SET: !!process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN_SET: !!process.env.KV_REST_API_TOKEN,
  };

  return NextResponse.json(envVars);
}