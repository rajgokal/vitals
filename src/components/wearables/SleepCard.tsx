'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SleepRecord {
  date: string;
  sleep_score: number | null;
  total_sleep_minutes: number | null;
  deep_sleep_minutes: number | null;
  rem_sleep_minutes: number | null;
  light_sleep_minutes: number | null;
  awake_minutes: number | null;
  efficiency: number | null;
  hr_lowest: number | null;
  hr_average: number | null;
  hrv_average: number | null;
  breath_average: number | null;
  temperature_delta: number | null;
}

function minsToHrs(mins: number | null): string {
  if (mins === null) return '—';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

function scoreColor(score: number | null): string {
  if (score === null) return 'text-muted';
  if (score >= 85) return 'text-accent';
  if (score >= 70) return 'text-warning';
  return 'text-critical';
}

export default function SleepCard({ record }: { record: SleepRecord }) {
  const [expanded, setExpanded] = useState(false);
  const d = new Date(record.date + 'T00:00:00');

  return (
    <div
      className="border border-border rounded-lg p-4 hover:bg-card-hover cursor-pointer transition-all"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
          <p className="text-xs text-muted">{minsToHrs(record.total_sleep_minutes)} total</p>
        </div>
        <div className="text-right">
          <span className={cn('text-2xl font-bold', scoreColor(record.sleep_score))}>
            {record.sleep_score ?? '—'}
          </span>
        </div>
      </div>

      {/* Sleep stage bars */}
      <div className="mt-3 flex gap-0.5 h-2 rounded-full overflow-hidden">
        {record.deep_sleep_minutes && <div className="bg-indigo-500" style={{ flex: record.deep_sleep_minutes }} />}
        {record.rem_sleep_minutes && <div className="bg-purple-500" style={{ flex: record.rem_sleep_minutes }} />}
        {record.light_sleep_minutes && <div className="bg-blue-500" style={{ flex: record.light_sleep_minutes }} />}
        {record.awake_minutes && <div className="bg-amber-500" style={{ flex: record.awake_minutes }} />}
      </div>
      <div className="flex gap-3 mt-1.5 text-[10px] text-muted">
        <span>Deep {minsToHrs(record.deep_sleep_minutes)}</span>
        <span>REM {minsToHrs(record.rem_sleep_minutes)}</span>
        <span>Light {minsToHrs(record.light_sleep_minutes)}</span>
        <span>Awake {minsToHrs(record.awake_minutes)}</span>
      </div>

      {expanded && (
        <div className="mt-4 pt-3 border-t border-border grid grid-cols-2 gap-3 text-sm animate-in">
          <Stat label="Efficiency" value={record.efficiency ? `${Math.round(record.efficiency)}%` : null} />
          <Stat label="HR Lowest" value={record.hr_lowest ? `${Math.round(record.hr_lowest)} bpm` : null} />
          <Stat label="HR Avg" value={record.hr_average ? `${Math.round(record.hr_average)} bpm` : null} />
          <Stat label="HRV Avg" value={record.hrv_average ? `${Math.round(record.hrv_average)} ms` : null} />
          <Stat label="Breath Avg" value={record.breath_average ? `${record.breath_average.toFixed(1)}/min` : null} />
          <Stat label="Temp Δ" value={record.temperature_delta ? `${record.temperature_delta > 0 ? '+' : ''}${record.temperature_delta.toFixed(2)}°` : null} />
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="font-medium">{value ?? '—'}</p>
    </div>
  );
}
