import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { isAgentAuth, getPagination, getDateRange, forbidden } from '@/lib/wearable-helpers';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const { limit, offset } = getPagination(url);
  const { from, to } = getDateRange(url);

  let query = `SELECT * FROM wearable_sleep WHERE 1=1`;
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
    // Process in batches of 50
    for (let i = 0; i < records.length; i += 50) {
      const batch = records.slice(i, i + 50);
      const values: string[] = [];
      const params: unknown[] = [];
      let idx = 1;

      for (const r of batch) {
        values.push(`($${idx++},$${idx++},$${idx++},$${idx++},$${idx++},$${idx++},$${idx++},$${idx++},$${idx++},$${idx++},$${idx++},$${idx++},$${idx++},$${idx++},$${idx++},$${idx++},$${idx++})`);
        params.push(
          r.source, r.date, r.total_sleep_minutes, r.deep_sleep_minutes,
          r.rem_sleep_minutes, r.light_sleep_minutes, r.awake_minutes,
          r.sleep_score, r.bedtime_start || null, r.bedtime_end || null,
          r.efficiency, r.hr_lowest, r.hr_average, r.hrv_average,
          r.breath_average, r.temperature_delta, r.raw_json ? JSON.stringify(r.raw_json) : null
        );
      }

      const q = `INSERT INTO wearable_sleep (source,date,total_sleep_minutes,deep_sleep_minutes,rem_sleep_minutes,light_sleep_minutes,awake_minutes,sleep_score,bedtime_start,bedtime_end,efficiency,hr_lowest,hr_average,hrv_average,breath_average,temperature_delta,raw_json) VALUES ${values.join(',')} ON CONFLICT ON CONSTRAINT uq_sleep_source_date DO UPDATE SET total_sleep_minutes=EXCLUDED.total_sleep_minutes,deep_sleep_minutes=EXCLUDED.deep_sleep_minutes,rem_sleep_minutes=EXCLUDED.rem_sleep_minutes,light_sleep_minutes=EXCLUDED.light_sleep_minutes,awake_minutes=EXCLUDED.awake_minutes,sleep_score=EXCLUDED.sleep_score,bedtime_start=EXCLUDED.bedtime_start,bedtime_end=EXCLUDED.bedtime_end,efficiency=EXCLUDED.efficiency,hr_lowest=EXCLUDED.hr_lowest,hr_average=EXCLUDED.hr_average,hrv_average=EXCLUDED.hrv_average,breath_average=EXCLUDED.breath_average,temperature_delta=EXCLUDED.temperature_delta,raw_json=EXCLUDED.raw_json`;
      const result = await sql.query(q, params);
      inserted += result.rowCount ?? batch.length;
    }

    return NextResponse.json({ ok: true, inserted });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
