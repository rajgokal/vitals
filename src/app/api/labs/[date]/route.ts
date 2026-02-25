import { NextResponse } from 'next/server';
import { kvGet } from '@/lib/kv';
import type { LabDraw } from '@/lib/types';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  const { date } = await params;
  const draws = await kvGet<LabDraw[]>('vitals:labs') ?? [];
  const draw = draws.find(d => d.date === date);
  if (!draw) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(draw);
}
