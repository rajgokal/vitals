import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  const [latestSleep, latestReadiness, latestActivity, sleep7d, sleep30d, readiness7d, readiness30d, activity7d, activity30d] = await Promise.all([
    sql`SELECT date, sleep_score, total_sleep_minutes, deep_sleep_minutes, rem_sleep_minutes, light_sleep_minutes, awake_minutes, hr_lowest, hrv_average FROM wearable_sleep ORDER BY date DESC LIMIT 1`,
    sql`SELECT date, score, resting_heart_rate, hrv_balance FROM wearable_readiness ORDER BY date DESC LIMIT 1`,
    sql`SELECT date, score, steps, active_calories FROM wearable_activity ORDER BY date DESC LIMIT 1`,
    sql`SELECT ROUND(AVG(sleep_score)) AS avg_score, ROUND(AVG(total_sleep_minutes)) AS avg_minutes FROM wearable_sleep WHERE date >= CURRENT_DATE - INTERVAL '7 days'`,
    sql`SELECT ROUND(AVG(sleep_score)) AS avg_score, ROUND(AVG(total_sleep_minutes)) AS avg_minutes FROM wearable_sleep WHERE date >= CURRENT_DATE - INTERVAL '30 days'`,
    sql`SELECT ROUND(AVG(score)) AS avg_score FROM wearable_readiness WHERE date >= CURRENT_DATE - INTERVAL '7 days'`,
    sql`SELECT ROUND(AVG(score)) AS avg_score FROM wearable_readiness WHERE date >= CURRENT_DATE - INTERVAL '30 days'`,
    sql`SELECT ROUND(AVG(score)) AS avg_score, ROUND(AVG(steps)) AS avg_steps FROM wearable_activity WHERE date >= CURRENT_DATE - INTERVAL '7 days'`,
    sql`SELECT ROUND(AVG(score)) AS avg_score, ROUND(AVG(steps)) AS avg_steps FROM wearable_activity WHERE date >= CURRENT_DATE - INTERVAL '30 days'`,
  ]);

  return NextResponse.json({
    latest: {
      sleep: latestSleep.rows[0] || null,
      readiness: latestReadiness.rows[0] || null,
      activity: latestActivity.rows[0] || null,
    },
    averages: {
      sleep: { '7d': sleep7d.rows[0], '30d': sleep30d.rows[0] },
      readiness: { '7d': readiness7d.rows[0], '30d': readiness30d.rows[0] },
      activity: { '7d': activity7d.rows[0], '30d': activity30d.rows[0] },
    },
  });
}
