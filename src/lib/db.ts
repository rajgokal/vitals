import { sql } from '@vercel/postgres';

export { sql };

export async function runMigrations() {
  await sql`
    CREATE TABLE IF NOT EXISTS wearable_sleep (
      id SERIAL PRIMARY KEY,
      source VARCHAR(20) NOT NULL,
      date DATE NOT NULL,
      total_sleep_minutes INTEGER,
      deep_sleep_minutes INTEGER,
      rem_sleep_minutes INTEGER,
      light_sleep_minutes INTEGER,
      awake_minutes INTEGER,
      sleep_score INTEGER,
      bedtime_start TIMESTAMP,
      bedtime_end TIMESTAMP,
      efficiency REAL,
      hr_lowest REAL,
      hr_average REAL,
      hrv_average REAL,
      breath_average REAL,
      temperature_delta REAL,
      raw_json JSONB,
      created_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT uq_sleep_source_date UNIQUE (source, date)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS wearable_readiness (
      id SERIAL PRIMARY KEY,
      source VARCHAR(20) NOT NULL,
      date DATE NOT NULL,
      score INTEGER,
      temperature_deviation REAL,
      previous_night_score INTEGER,
      sleep_balance INTEGER,
      previous_day_activity INTEGER,
      activity_balance INTEGER,
      resting_heart_rate REAL,
      hrv_balance REAL,
      recovery_index REAL,
      raw_json JSONB,
      created_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT uq_readiness_source_date UNIQUE (source, date)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS wearable_activity (
      id SERIAL PRIMARY KEY,
      source VARCHAR(20) NOT NULL,
      date DATE NOT NULL,
      score INTEGER,
      steps INTEGER,
      active_calories INTEGER,
      total_calories INTEGER,
      sedentary_minutes INTEGER,
      low_activity_minutes INTEGER,
      medium_activity_minutes INTEGER,
      high_activity_minutes INTEGER,
      rest_mode_state VARCHAR(20),
      raw_json JSONB,
      created_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT uq_activity_source_date UNIQUE (source, date)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS wearable_heart_rate (
      id SERIAL PRIMARY KEY,
      source VARCHAR(20) NOT NULL,
      timestamp TIMESTAMP NOT NULL,
      bpm INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_hr_timestamp ON wearable_heart_rate(timestamp)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_hr_source ON wearable_heart_rate(source)`;

  await sql`
    CREATE TABLE IF NOT EXISTS wearable_stress (
      id SERIAL PRIMARY KEY,
      source VARCHAR(20) NOT NULL,
      date DATE NOT NULL,
      stress_high_minutes INTEGER,
      recovery_high_minutes INTEGER,
      max_stress REAL,
      day_summary VARCHAR(20),
      raw_json JSONB,
      created_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT uq_stress_source_date UNIQUE (source, date)
    )
  `;
}
