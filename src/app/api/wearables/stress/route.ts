import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { isAgentAuth, getPagination, getDateRange, forbidden } from '@/lib/wearable-helpers';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const { limit, offset } = getPagination(url);
  const { from, to } = getDateRange(url);

  let query = `SELECT * FROM wearable_stress WHERE 1=1`;
  const params: (string | number)[] = [];
  let idx = 1;

  if (from) { query += ` AND date >= $${idx++}`; params.push(from); }
  if (to) { query += ` AND date <= $${idx++}`; params.push(to); }
  query += ` ORDER BY date DESC LIMIT $${idx++} OFFSET $${idx++}`;
  params.push(limit, offset);

  const result = await sql.query(query, params);
  return NextResponse.json(result.rows);
}

export async function POST(request: NextRequest) {
  if (!isAgentAuth(request)) return forbidden();

  try {
    const { records } = await request.json();
    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: 'records array required' }, { status: 400 });
    }

    let inserted = 0;
    for (let i = 0; i < records.length; i += 50) {
      const batch = records.slice(i, i + 50);
      const values: string[] = [];
      const params: unknown[] = [];
      let idx = 1;

      for (const r of batch) {
        values.push(`($${idx++},$${idx++},$${idx++},$${idx++},$${idx++},$${idx++})`);
        params.push(
          r.source, r.date, r.stress_high_minutes,
          r.recovery_high_minutes, r.max_stress, r.day_summary || null
        );
      }

      const q = `INSERT INTO wearable_stress (source,date,stress_high_minutes,recovery_high_minutes,max_stress,day_summary) VALUES ${values.join(',')} ON CONFLICT ON CONSTRAINT uq_stress_source_date DO UPDATE SET stress_high_minutes=EXCLUDED.stress_high_minutes,recovery_high_minutes=EXCLUDED.recovery_high_minutes,max_stress=EXCLUDED.max_stress,day_summary=EXCLUDED.day_summary`;
      const result = await sql.query(q, params);
      inserted += result.rowCount ?? batch.length;
    }

    return NextResponse.json({ ok: true, inserted });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
