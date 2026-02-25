'use client';

import { useState } from 'react';
import SleepCard from '@/components/wearables/SleepCard';
import TrendChart from '@/components/wearables/TrendChart';
import { useWearableData } from '@/hooks/useWearableData';

interface SleepRow {
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

export default function SleepPage() {
  const [page, setPage] = useState(1);
  const { data: trendData } = useWearableData<SleepRow[]>({ endpoint: 'sleep', params: { limit: '30' } });
  const { data, loading } = useWearableData<SleepRow[]>({ endpoint: 'sleep', params: { limit: '30', page: String(page) } });

  return (
    <div className="space-y-6 animate-in">
      <section className="border border-border rounded-xl p-4">
        <h2 className="text-sm font-medium text-muted mb-3">Sleep Score — 30 Day Trend</h2>
        <TrendChart
          data={(trendData ?? []).filter(r => r.sleep_score).reverse().map(r => ({ date: r.date, score: r.sleep_score }))}
          dataKey="score" color="#4ade80" height={160}
        />
      </section>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-lg" />)
        ) : data && data.length > 0 ? (
          data.map(record => <SleepCard key={record.date} record={record} />)
        ) : (
          <p className="text-muted text-sm text-center py-8">No sleep data yet. Push data via the API to get started.</p>
        )}
      </div>

      {data && data.length >= 30 && (
        <div className="flex justify-center gap-3">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-card-hover disabled:opacity-30">
            ← Newer
          </button>
          <button onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-card-hover">
            Older →
          </button>
        </div>
      )}
    </div>
  );
}
