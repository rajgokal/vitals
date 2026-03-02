import { NextResponse } from 'next/server';
import { kvGet } from '@/lib/kv';
import type { LabDraw } from '@/lib/types';

export interface LatestMarker {
  name: string;
  value: number | string;
  unit: string;
  referenceRange?: { low?: number; high?: number; text?: string } | null;
  range?: string;
  flag?: 'high' | 'low' | 'critical';
  category?: string;
  date: string;
  source: string;
  historyCount: number;
}

export async function GET() {
  const raw = await kvGet<unknown[]>('vitals:labs') ?? [];
  // Filter corrupted entries
  const draws = raw.filter(
    (d): d is LabDraw =>
      d != null && typeof d === 'object' && !Array.isArray(d) &&
      typeof (d as Record<string, unknown>).date === 'string' &&
      Array.isArray((d as Record<string, unknown>).markers)
  );
  if (!draws.length) return NextResponse.json({ markers: [], drawCount: 0 });

  // Sort draws by date descending
  const sorted = [...draws].sort((a, b) => b.date.localeCompare(a.date));

  const latest = new Map<string, LatestMarker>();
  const counts = new Map<string, number>();

  // Count occurrences first
  for (const draw of sorted) {
    for (const m of draw.markers) {
      counts.set(m.name, (counts.get(m.name) ?? 0) + 1);
    }
  }

  // Pick most recent value per marker (sorted is already desc by date)
  for (const draw of sorted) {
    for (const m of draw.markers) {
      if (!latest.has(m.name)) {
        latest.set(m.name, {
          name: m.name,
          value: m.value,
          unit: m.unit,
          referenceRange: m.referenceRange,
          range: m.range,
          flag: m.flag,
          category: m.category,
          date: draw.date,
          source: draw.source,
          historyCount: counts.get(m.name) ?? 1,
        });
      }
    }
  }

  // Sort by historyCount descending (most frequent first), then name as tiebreaker
  const markers = Array.from(latest.values()).sort((a, b) => {
    if (b.historyCount !== a.historyCount) return b.historyCount - a.historyCount;
    return a.name.localeCompare(b.name);
  });

  return NextResponse.json({ markers, drawCount: sorted.length });
}
