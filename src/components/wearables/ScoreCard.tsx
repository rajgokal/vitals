'use client';

import { cn } from '@/lib/utils';

interface ScoreCardProps {
  label: string;
  score: number | null;
  subtitle?: string;
  trend?: number | null; // positive = improving
  icon: string;
}

function scoreColor(score: number | null): string {
  if (score === null) return 'text-muted';
  if (score >= 85) return 'text-accent';
  if (score >= 70) return 'text-warning';
  return 'text-critical';
}

function scoreBg(score: number | null): string {
  if (score === null) return 'bg-card';
  if (score >= 85) return 'bg-accent-dim';
  if (score >= 70) return 'bg-amber-500/10';
  return 'bg-red-500/10';
}

export default function ScoreCard({ label, score, subtitle, trend, icon }: ScoreCardProps) {
  return (
    <div className={cn('rounded-xl border border-border p-4 animate-in', scoreBg(score))}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted text-sm">{icon} {label}</span>
        {trend !== null && trend !== undefined && (
          <span className={cn('text-xs font-medium', trend >= 0 ? 'text-accent' : 'text-critical')}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}
          </span>
        )}
      </div>
      <div className={cn('text-4xl font-bold tracking-tight', scoreColor(score))}>
        {score ?? '—'}
      </div>
      {subtitle && <p className="text-xs text-muted mt-1">{subtitle}</p>}
    </div>
  );
}
