'use client';

import { useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import CompactMarkerRow from '@/components/CompactMarkerRow';
import type { LatestMarker } from '@/app/api/labs/latest-all/route';
import type { LabDraw } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

interface LatestAllResponse {
  markers: LatestMarker[];
  drawCount: number;
}

export default function LabsPage() {
  const [markerData, setMarkerData] = useState<LatestAllResponse | null>(null);
  const [draws, setDraws] = useState<LabDraw[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/labs/latest-all')
      .then(r => r.json())
      .then(setMarkerData)
      .catch(() => setError(true));
    fetch('/api/labs')
      .then(r => r.json())
      .then((d: LabDraw[]) => setDraws(d.sort((a, b) => b.date.localeCompare(a.date))))
      .catch(() => {});
  }, []);

  const markers = markerData?.markers ?? [];
  const drawCount = markerData?.drawCount ?? 0;
  const sortedDraws = draws ?? [];

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight">Labs</h1>
            {markers.length > 0 && (
              <span className="text-xs text-muted">{markers.length} markers</span>
            )}
          </div>

          {/* All Markers */}
          {error ? (
            <p className="text-muted text-sm">Failed to load markers</p>
          ) : !markerData ? (
            <div className="space-y-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton h-7 w-full rounded-lg" />
              ))}
            </div>
          ) : markers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
              <p className="text-muted text-sm">No lab data yet</p>
              <p className="text-xs text-muted mt-1">Lab draws will appear here once uploaded</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-3">
              <p className="text-xs text-muted mb-2 px-2">
                {markers.length} markers across {drawCount} draw{drawCount !== 1 ? 's' : ''} · sorted by frequency
              </p>
              <div className="space-y-px">
                {markers.map(m => (
                  <CompactMarkerRow
                    key={m.name}
                    marker={m}
                    date={m.date}
                    historyCount={m.historyCount}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Lab Draws */}
          {sortedDraws.length > 0 && (
            <>
              <div className="border-t border-border pt-4">
                <h2 className="text-sm font-medium text-muted mb-3">Lab Draws</h2>
              </div>
              <div className="space-y-3">
                {sortedDraws.map((draw, i) => {
                  const flagged = draw.markers.filter(m => m.flag);
                  return (
                    <Link
                      key={draw.date}
                      href={`/labs/${draw.date}`}
                      className="block rounded-xl border border-border bg-card p-4 hover:bg-card-hover hover:border-border/80 transition-all duration-150 animate-in"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{formatDate(draw.date)}</p>
                          <p className="text-xs text-muted mt-0.5">{draw.source} · {draw.markers.length} markers</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {flagged.length > 0 && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full text-warning bg-warning/10 border border-warning/20">
                              {flagged.length} flagged
                            </span>
                          )}
                          <span className="text-xs text-muted">→</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
