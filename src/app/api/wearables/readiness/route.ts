import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { isAgentAuth, getPagination, getDateRange, forbidden } from '@/lib/wearable-helpers';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const { limit, offset } = getPagination(url);
  const { from, to } = getDateRange(url);

  let query = `SELECT * FROM wearable_readiness WHERE 1=1`;
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
          r.source, r.date, r.score, r.temperature_deviation,
          r.previous_night_score, r.sleep_balance, r.previous_day_activity,
          r.activity_balance, r.resting_heart_rate, r.hrv_balance,
          r.recovery_index
        );
      }

      const q = `INSERT INTO wearable_readiness (source,date,score,temperature_deviation,previous_night_score,sleep_balance,previous_day_activity,activity_balance,resting_heart_rate,hrv_balance,recovery_index) VALUES ${values.join(',')} ON CONFLICT ON CONSTRAINT uq_readiness_source_date DO UPDATE SET score=EXCLUDED.score,temperature_deviation=EXCLUDED.temperature_deviation,previous_night_score=EXCLUDED.previous_night_score,sleep_balance=EXCLUDED.sleep_balance,previous_day_activity=EXCLUDED.previous_day_activity,activity_balance=EXCLUDED.activity_balance,resting_heart_rate=EXCLUDED.resting_heart_rate,hrv_balance=EXCLUDED.hrv_balance,recovery_index=EXCLUDED.recovery_index`;
      const result = await sql.query(q, params);
      inserted += result.rowCount ?? batch.length;
    }

    return NextResponse.json({ ok: true, inserted });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
