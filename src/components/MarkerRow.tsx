'use client';

import { useState } from 'react';
import type { LabMarker } from '@/lib/types';
import { flagColor } from '@/lib/utils';
import MarkerTrend from './MarkerTrend';

interface MarkerRowProps {
  marker: LabMarker;
  date?: string;
  historyCount?: number;
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function MarkerRow({ marker, date, historyCount }: MarkerRowProps) {
  const [expanded, setExpanded] = useState(false);

  const ref = marker.referenceRange;
  const rangeText = marker.range
    ?? ref?.text
    ?? (ref?.low != null && ref?.high != null
      ? `${ref.low}–${ref.high}`
      : '');

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded(prev => !prev)}
        className="w-full flex items-center justify-between py-2 px-2.5 rounded-lg hover:bg-card-hover cursor-pointer text-left"
      >
        <div className="flex-1 min-w-0">
          <span className="text-sm">{marker.name}</span>
          {marker.category && (
            <span className="text-xs text-muted ml-2 hidden sm:inline">{marker.category}</span>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-right">
          <span className={`text-sm font-mono font-medium ${flagColor(marker.flag)}`}>
            {marker.value} <span className="text-xs text-muted">{marker.unit}</span>
          </span>
          {date && (
            <span className="text-[10px] text-muted">{formatShortDate(date)}</span>
          )}
          {rangeText && (
            <span className="text-xs text-muted w-24 text-right hidden sm:block">{rangeText}</span>
          )}
          {marker.flag && (
            <span className={`text-xs font-medium uppercase ${flagColor(marker.flag)}`}>
              {marker.flag}
            </span>
          )}
          <span className={`text-xs text-muted transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>▾</span>
        </div>
      </button>
      <div
        className="overflow-hidden transition-all duration-200 ease-out"
        style={{ maxHeight: expanded ? '200px' : '0px', opacity: expanded ? 1 : 0 }}
      >
        {expanded && (
          <div className="px-2.5 pb-2">
            <MarkerTrend
              markerName={marker.name}
              unit={marker.unit}
              refLow={ref?.low}
              refHigh={ref?.high}
              historyCount={historyCount}
            />
          </div>
        )}
      </div>
    </div>
  );
}
