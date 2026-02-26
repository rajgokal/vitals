'use client';

import { useState } from 'react';
import type { LabMarker } from '@/lib/types';
import { flagColor } from '@/lib/utils';
import MarkerTrend from './MarkerTrend';

interface CompactMarkerRowProps {
  marker: LabMarker;
  date?: string;
  historyCount?: number;
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function CompactMarkerRow({ marker, date, historyCount }: CompactMarkerRowProps) {
  const [expanded, setExpanded] = useState(false);

  const ref = marker.referenceRange;

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded(prev => !prev)}
        className="w-full flex items-center justify-between py-1 px-2 rounded-lg hover:bg-card-hover cursor-pointer text-left gap-2"
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {historyCount != null && historyCount > 1 && (
            <span className="text-[10px] text-muted font-mono shrink-0">×{historyCount}</span>
          )}
          <span className="text-xs truncate">{marker.name}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-mono font-medium ${flagColor(marker.flag)}`}>
            {marker.value} <span className="text-[10px] text-muted">{marker.unit}</span>
          </span>
          {date && (
            <span className="text-[10px] text-muted hidden sm:inline">{formatShortDate(date)}</span>
          )}
          {marker.flag && (
            <span className={`text-[10px] font-semibold uppercase px-1 py-px rounded ${flagColor(marker.flag)} bg-current/10`}>
              {marker.flag}
            </span>
          )}
          <span className={`text-[10px] text-muted transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>▾</span>
        </div>
      </button>
      <div
        className="overflow-hidden transition-all duration-200 ease-out"
        style={{ maxHeight: expanded ? '200px' : '0px', opacity: expanded ? 1 : 0 }}
      >
        {expanded && (
          <div className="px-2 pb-1">
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
