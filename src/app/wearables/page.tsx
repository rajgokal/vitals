'use client';

import ScoreCard from '@/components/wearables/ScoreCard';
import SleepChart from '@/components/wearables/SleepChart';
import TrendChart from '@/components/wearables/TrendChart';
import { useWearableData } from '@/hooks/useWearableData';

interface SummaryData {
  latest: {
    sleep: { sleep_score: number; total_sleep_minutes: number } | null;
    readiness: { score: number; resting_heart_rate: number } | null;
    activity: { score: number; steps: number } | null;
  };
  averages: {
    sleep: { '7d': { avg_score: number }; '30d': { avg_score: number } };
    readiness: { '7d': { avg_score: number }; '30d': { avg_score: number } };
    activity: { '7d': { avg_score: number }; '30d': { avg_score: number } };
  };
}

interface SleepRow {
  date: string;
  sleep_score: number | null;
  deep_sleep_minutes: number | null;
  rem_sleep_minutes: number | null;
  light_sleep_minutes: number | null;
  awake_minutes: number | null;
  hrv_average: number | null;
}

interface HRRow { bucket: string; min_bpm: number; avg_bpm: number }

function minsToHrs(mins: number | null): string {
  if (!mins) return '—';
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export default function WearablesDashboard() {
  const { data: summary, loading } = useWearableData<SummaryData>({ endpoint: 'summary' });
  const { data: sleep7 } = useWearableData<SleepRow[]>({ endpoint: 'sleep', params: { limit: '7' } });
  const { data: sleep30 } = useWearableData<SleepRow[]>({ endpoint: 'sleep', params: { limit: '30' } });
  const { data: hrData } = useWearableData<HRRow[]>({ endpoint: 'heart-rate', params: { resolution: 'daily' } });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-28 rounded-xl" />)}
        </div>
        <div className="skeleton h-60 rounded-xl" />
      </div>
    );
  }

  const s = summary;
  const trend = (k: 'sleep' | 'readiness' | 'activity') =>
    s ? Math.round(Number(s.averages[k]['7d']?.avg_score || 0) - Number(s.averages[k]['30d']?.avg_score || 0)) : null;

  return (
    <div className="space-y-6 animate-in">
      <div className="grid grid-cols-3 gap-3">
        <ScoreCard label="Sleep" icon="🌙" score={s?.latest.sleep?.sleep_score ?? null}
          subtitle={s?.latest.sleep ? minsToHrs(s.latest.sleep.total_sleep_minutes) : undefined} trend={trend('sleep')} />
        <ScoreCard label="Readiness" icon="⚡" score={s?.latest.readiness?.score ?? null}
          subtitle={s?.latest.readiness ? `HR ${Math.round(s.latest.readiness.resting_heart_rate)} bpm` : undefined} trend={trend('readiness')} />
        <ScoreCard label="Activity" icon="🏃" score={s?.latest.activity?.score ?? null}
          subtitle={s?.latest.activity ? `${s.latest.activity.steps?.toLocaleString()} steps` : undefined} trend={trend('activity')} />
      </div>

      <section className="border border-border rounded-xl p-4">
        <h2 className="text-sm font-medium text-muted mb-3">Sleep Stages — Last 7 Days</h2>
        <SleepChart data={sleep7 ?? []} />
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="border border-border rounded-xl p-4">
          <h2 className="text-sm font-medium text-muted mb-3">Resting HR — 30 Days</h2>
          <TrendChart
            data={(hrData ?? []).slice(0, 30).reverse().map(r => ({ date: r.bucket, bpm: Number(r.min_bpm) }))}
            dataKey="bpm" color="#ef4444" unit=" bpm" height={180}
          />
        </section>
        <section className="border border-border rounded-xl p-4">
          <h2 className="text-sm font-medium text-muted mb-3">HRV — 30 Days</h2>
          <TrendChart
            data={(sleep30 ?? []).filter(r => r.hrv_average).reverse().map(r => ({ date: r.date, hrv: Math.round(Number(r.hrv_average)) }))}
            dataKey="hrv" color="#a855f7" unit=" ms" height={180}
          />
        </section>
      </div>
    </div>
  );
}
