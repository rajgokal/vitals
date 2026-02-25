'use client';

import { useState } from 'react';
import TrendChart from '@/components/wearables/TrendChart';
import { useWearableData } from '@/hooks/useWearableData';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { cn } from '@/lib/utils';

interface ActivityRow {
  date: string;
  score: number | null;
  steps: number | null;
  active_calories: number | null;
  total_calories: number | null;
  sedentary_minutes: number | null;
  low_activity_minutes: number | null;
  medium_activity_minutes: number | null;
  high_activity_minutes: number | null;
}

function scoreColor(score: number | null): string {
  if (score === null) return 'text-muted';
  if (score >= 85) return 'text-accent';
  if (score >= 70) return 'text-warning';
  return 'text-critical';
}

export default function ActivityPage() {
  const [page, setPage] = useState(1);
  const { data, loading } = useWearableData<ActivityRow[]>({ endpoint: 'activity', params: { limit: '30', page: String(page) } });

  const chartData = (data ?? []).slice(0, 14).reverse().map(d => ({
    date: d.date,
    Sedentary: d.sedentary_minutes ?? 0,
    Low: d.low_activity_minutes ?? 0,
    Medium: d.medium_activity_minutes ?? 0,
    High: d.high_activity_minutes ?? 0,
  }));

  return (
    <div className="space-y-6 animate-in">
      {/* Steps trend */}
      <section className="border border-border rounded-xl p-4">
        <h2 className="text-sm font-medium text-muted mb-3">Daily Steps — 30 Days</h2>
        <TrendChart
          data={(data ?? []).filter(r => r.steps).reverse().map(r => ({ date: r.date, steps: r.steps }))}
          dataKey="steps" color="#4ade80" height={160}
        />
      </section>

      {/* Activity breakdown */}
      <section className="border border-border rounded-xl p-4">
        <h2 className="text-sm font-medium text-muted mb-3">Activity Breakdown — 14 Days</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis dataKey="date" tick={{ fill: '#71717a', fontSize: 11 }} tickLine={false} axisLine={false}
                tickFormatter={(v: string) => { const d = new Date(v + 'T00:00:00'); return `${d.getMonth() + 1}/${d.getDate()}`; }} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} tickLine={false} axisLine={false}
                tickFormatter={(v: number) => `${Math.round(v / 60)}h`} />
              <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 12 }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={((v: any, name: any) => [`${Math.round(v ?? 0)}min`, name]) as any} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="High" stackId="a" fill="#4ade80" />
              <Bar dataKey="Medium" stackId="a" fill="#3b82f6" />
              <Bar dataKey="Low" stackId="a" fill="#6366f1" />
              <Bar dataKey="Sedentary" stackId="a" fill="#27272a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-muted text-sm text-center py-8">No activity data</p>}
      </section>

      {/* Activity list */}
      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-lg" />)
        ) : data && data.length > 0 ? (
          data.map(row => (
            <div key={row.date} className="border border-border rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{new Date(row.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                <p className="text-xs text-muted">{row.steps?.toLocaleString() ?? '—'} steps · {row.active_calories ?? '—'} cal</p>
              </div>
              <span className={cn('text-2xl font-bold', scoreColor(row.score))}>{row.score ?? '—'}</span>
            </div>
          ))
        ) : (
          <p className="text-muted text-sm text-center py-8">No activity data yet.</p>
        )}
      </div>

      {data && data.length >= 30 && (
        <div className="flex justify-center gap-3">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-card-hover disabled:opacity-30">← Newer</button>
          <button onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-card-hover">Older →</button>
        </div>
      )}
    </div>
  );
}
