'use client';

import { useState } from 'react';
import type { SymptomEntry } from '@/lib/symptoms-data';
import SeverityBadge from './SeverityBadge';

function formatTimelineDate(dateStr: string): string {
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

interface TimelineEntryProps {
  entry: SymptomEntry;
  index: number;
  isLast: boolean;
}

export default function TimelineEntry({ entry, index, isLast }: TimelineEntryProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="relative flex gap-4 animate-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Timeline spine */}
      <div className="flex flex-col items-center shrink-0 w-12">
        <div className="w-3 h-3 rounded-full bg-accent border-2 border-background z-10 mt-1.5 shrink-0" />
        {!isLast && (
          <div className="w-px flex-1 bg-border -mt-px" />
        )}
      </div>

      {/* Content card */}
      <button
        type="button"
        onClick={() => setExpanded(prev => !prev)}
        className="flex-1 text-left rounded-xl border border-border bg-card p-4 mb-4 hover:bg-card-hover hover:border-border/80 transition-all cursor-pointer"
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <p className="text-[11px] text-muted font-mono mb-1">
              {formatTimelineDate(entry.date)}
            </p>
            <h3 className="text-sm font-medium leading-snug">{entry.label}</h3>
          </div>
          <SeverityBadge severity={entry.severity} />
        </div>

        <p className="text-xs text-muted leading-relaxed">{entry.description}</p>

        {/* Outcome */}
        <div className="mt-3 flex items-center gap-1.5">
          <span className="text-accent text-[10px]">→</span>
          <span className="text-xs text-accent/80">{entry.outcome}</span>
        </div>

        {/* Expanded details */}
        <div
          className="overflow-hidden transition-all duration-200 ease-out"
          style={{ maxHeight: expanded ? '200px' : '0px', opacity: expanded ? 1 : 0 }}
        >
          <div className="pt-3 mt-3 border-t border-border space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted">Duration:</span>
              <span>{entry.duration}</span>
            </div>
            {entry.triggers.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted">Triggers:</span>
                {entry.triggers.map(t => (
                  <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-warning/10 text-warning border border-warning/20">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-1.5 flex-wrap">
              {entry.tags.map(tag => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-accent-dim text-accent border border-accent/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
