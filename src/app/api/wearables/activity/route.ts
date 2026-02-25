import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { isAgentAuth, getPagination, getDateRange, forbidden } from '@/lib/wearable-helpers';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const { limit, offset } = getPagination(url);
  const { from, to } = getDateRange(url);

  let query = `SELECT * FROM wearable_activity WHERE 1=1`;
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
        values.push(`($${idx++},$${idx++},$${idx++},$${idx++},$${idx++},$${idx++},$${idx++},$${idx++},$${idx++},$${idx++},$${idx++})`);
        params.push(
          r.source, r.date, r.score, r.steps,
          r.active_calories, r.total_calories, r.sedentary_minutes,
          r.low_activity_minutes, r.medium_activity_minutes,
          r.high_activity_minutes, r.rest_mode_state || null
        );
      }

      const q = `INSERT INTO wearable_activity (source,date,score,steps,active_calories,total_calories,sedentary_minutes,low_activity_minutes,medium_activity_minutes,high_activity_minutes,rest_mode_state) VALUES ${values.join(',')} ON CONFLICT ON CONSTRAINT uq_activity_source_date DO UPDATE SET score=EXCLUDED.score,steps=EXCLUDED.steps,active_calories=EXCLUDED.active_calories,total_calories=EXCLUDED.total_calories,sedentary_minutes=EXCLUDED.sedentary_minutes,low_activity_minutes=EXCLUDED.low_activity_minutes,medium_activity_minutes=EXCLUDED.medium_activity_minutes,high_activity_minutes=EXCLUDED.high_activity_minutes,rest_mode_state=EXCLUDED.rest_mode_state`;
      const result = await sql.query(q, params);
      inserted += result.rowCount ?? batch.length;
    }

    return NextResponse.json({ ok: true, inserted });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
