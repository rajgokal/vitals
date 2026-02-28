'use client';

import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceArea,
  Tooltip,
  ReferenceDot,
} from 'recharts';

interface DataPoint {
  date: string;
  value: number;
  flag?: 'high' | 'low' | 'critical';
}

interface MarkerTrendProps {
  markerName: string;
  unit: string;
  refLow?: number;
  refHigh?: number;
  historyCount?: number;
}

export default function MarkerTrend({ markerName, unit, refLow, refHigh, historyCount }: MarkerTrendProps) {
  const [data, setData] = useState<DataPoint[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/labs?marker=${encodeURIComponent(markerName)}`)
      .then(r => r.json())
      .then((draws: { date: string; markers: { name: string; value: number | string; flag?: string }[] }[]) => {
        const points: DataPoint[] = [];
        for (const d of draws) {
          const m = d.markers.find(
            mk => mk.name.toLowerCase() === markerName.toLowerCase()
          );
          if (m && typeof m.value === 'number') {
            points.push({
              date: d.date,
              value: m.value,
              flag: m.flag as DataPoint['flag'],
            });
          }
        }
        points
          .sort((a, b) => a.date.localeCompare(b.date));
        setData(points);
      })
      .catch(() => setError(true));
  }, [markerName]);

  if (error) return <p className="text-xs text-muted py-2">Failed to load trend</p>;
  if (!data) {
    return (
      <div className="h-28 w-full flex items-center justify-center">
        <div className="skeleton h-20 w-full" />
      </div>
    );
  }
  if (data.length < 2) {
    if (data.length === 1) {
      return (
        <div className="flex items-center gap-2 py-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-accent" />
          <span className="text-xs text-muted">
            {data[0].value} {unit} — {new Date(data[0].date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
          </span>
        </div>
      );
    }
    return <p className="text-xs text-muted py-2">Not enough data for trend</p>;
  }

  const values = data.map(d => d.value);
  const allVals = [...values];
  // Always show at least the top half of the reference range so the ideal zone is visible
  if (refLow != null && refHigh != null) {
    const refMid = (refLow + refHigh) / 2;
    allVals.push(refMid, refHigh);
  } else {
    if (refLow != null) allVals.push(refLow);
    if (refHigh != null) allVals.push(refHigh);
  }
  const yMin = Math.min(...allVals) * 0.92;
  const yMax = Math.max(...allVals) * 1.08;

  const flaggedPoints = data.filter(d => d.flag);

  const idealLabel = refLow != null && refHigh != null
    ? `Ideal: ${refLow}–${refHigh} ${unit}`
    : refHigh != null
      ? `Ideal: <${refHigh} ${unit}`
      : refLow != null
        ? `Ideal: >${refLow} ${unit}`
        : null;

  const formatLabel = (d: string) => {
    const dt = new Date(d);
    return dt.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  return (
    <div className="h-32 w-full mt-2 mb-1 relative">
      {idealLabel && (
        <div className="absolute top-0 right-2 z-10 text-[10px] text-accent/70 font-medium">
          {idealLabel}
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
          {refLow != null && refHigh != null && (
            <ReferenceArea
              y1={refLow}
              y2={refHigh}
              fill="var(--accent)"
              fillOpacity={0.07}
              strokeOpacity={0}
            />
          )}
          <XAxis
            dataKey="date"
            tickFormatter={formatLabel}
            tick={{ fontSize: 10, fill: 'var(--muted)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fontSize: 10, fill: 'var(--muted)' }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 12,
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            labelFormatter={(label: any) => formatLabel(String(label))}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(v: any) => [`${v} ${unit}`, markerName]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--accent)"
            strokeWidth={2}
            dot={{ r: 3, fill: 'var(--accent)', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: 'var(--accent)' }}
          />
          {flaggedPoints.map(p => (
            <ReferenceDot
              key={p.date}
              x={p.date}
              y={p.value}
              r={5}
              fill={p.flag === 'critical' ? 'var(--critical)' : p.flag === 'high' ? 'var(--warning)' : 'var(--info)'}
              stroke="none"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
