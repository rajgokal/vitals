'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface TrendChartProps {
  data: Array<Record<string, unknown>>;
  dataKey: string;
  xKey?: string;
  color?: string;
  height?: number;
  label?: string;
  unit?: string;
  showGrid?: boolean;
}

export default function TrendChart({
  data,
  dataKey,
  xKey = 'date',
  color = '#4ade80',
  height = 200,
  label,
  unit = '',
  showGrid = false,
}: TrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted text-sm">
        No data available
      </div>
    );
  }

  return (
    <div>
      {label && <p className="text-sm text-muted mb-2">{label}</p>}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />}
          <XAxis
            dataKey={xKey}
            tick={{ fill: '#71717a', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: string) => {
              const d = new Date(v);
              return `${d.getMonth() + 1}/${d.getDate()}`;
            }}
          />
          <YAxis
            tick={{ fill: '#71717a', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#71717a' }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={((value: any) => [`${value}${unit}`, dataKey]) as any}
            labelFormatter={((v: any) => new Date(v).toLocaleDateString()) as any}
          />
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#grad-${dataKey})`}
            dot={false}
            animationDuration={500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
