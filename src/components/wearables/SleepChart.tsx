'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface SleepDay {
  date: string;
  deep_sleep_minutes: number | null;
  rem_sleep_minutes: number | null;
  light_sleep_minutes: number | null;
  awake_minutes: number | null;
}

interface SleepChartProps {
  data: SleepDay[];
  height?: number;
}

function minsToHrs(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

export default function SleepChart({ data, height = 240 }: SleepChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-32 text-muted text-sm">No sleep data</div>;
  }

  const chartData = [...data].reverse().map(d => ({
    date: d.date,
    Deep: d.deep_sleep_minutes ?? 0,
    REM: d.rem_sleep_minutes ?? 0,
    Light: d.light_sleep_minutes ?? 0,
    Awake: d.awake_minutes ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <XAxis
          dataKey="date"
          tick={{ fill: '#71717a', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: string) => {
            const d = new Date(v + 'T00:00:00');
            return `${d.getMonth() + 1}/${d.getDate()}`;
          }}
        />
        <YAxis
          tick={{ fill: '#71717a', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `${Math.round(v / 60)}h`}
        />
        <Tooltip
          contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#71717a' }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={((value: any, name: any) => [minsToHrs(value ?? 0), name]) as any}
          labelFormatter={((v: any) => new Date(v + 'T00:00:00').toLocaleDateString()) as any}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: '#71717a' }} />
        <Bar dataKey="Deep" stackId="sleep" fill="#6366f1" radius={[0, 0, 0, 0]} />
        <Bar dataKey="REM" stackId="sleep" fill="#a855f7" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Light" stackId="sleep" fill="#3b82f6" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Awake" stackId="sleep" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
