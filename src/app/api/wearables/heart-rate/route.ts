import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { isAgentAuth, getDateRange, forbidden } from '@/lib/wearable-helpers';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const { from, to } = getDateRange(url);
  const resolution = url.searchParams.get('resolution') || 'daily';

  const params: (string | number)[] = [];
  let idx = 1;
  let whereClause = '';

  if (from) { whereClause += ` AND timestamp >= $${idx++}`; params.push(from); }
  if (to) { whereClause += ` AND timestamp <= $${idx++}`; params.push(to + 'T23:59:59'); }

  if (resolution === 'raw') {
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '100', 10) || 100, 1000);
    params.push(limit);
    const result = await sql.query(
      `SELECT source, timestamp, bpm FROM wearable_heart_rate WHERE 1=1 ${whereClause} ORDER BY timestamp DESC LIMIT $${idx++}`,
      params
    );
    return NextResponse.json(result.rows);
  }

  if (resolution === 'hourly') {
    const result = await sql.query(
      `SELECT date_trunc('hour', timestamp) AS bucket, source,
              ROUND(AVG(bpm)) AS avg_bpm, MIN(bpm) AS min_bpm, MAX(bpm) AS max_bpm, COUNT(*) AS samples
       FROM wearable_heart_rate WHERE 1=1 ${whereClause}
       GROUP BY bucket, source ORDER BY bucket DESC LIMIT 720`,
      params
    );
    return NextResponse.json(result.rows);
  }

  // daily (default)
  const result = await sql.query(
    `SELECT date_trunc('day', timestamp) AS bucket, source,
            ROUND(AVG(bpm)) AS avg_bpm, MIN(bpm) AS min_bpm, MAX(bpm) AS max_bpm, COUNT(*) AS samples
     FROM wearable_heart_rate WHERE 1=1 ${whereClause}
     GROUP BY bucket, source ORDER BY bucket DESC LIMIT 365`,
    params
  );
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
    // Process in batches of 500 (HR data can be huge)
    for (let i = 0; i < records.length; i += 500) {
      const batch = records.slice(i, i + 500);
      const values: string[] = [];
      const params: unknown[] = [];
      let idx = 1;

      for (const r of batch) {
        values.push(`($${idx++},$${idx++},$${idx++})`);
        params.push(r.source, r.timestamp, r.bpm);
      }

      const q = `INSERT INTO wearable_heart_rate (source, timestamp, bpm) VALUES ${values.join(',')}`;
      const result = await sql.query(q, params);
      inserted += result.rowCount ?? batch.length;
    }

    return NextResponse.json({ ok: true, inserted });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
