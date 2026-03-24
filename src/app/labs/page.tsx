'use client';

import { Suspense, useEffect, useState, useMemo } from 'react';
import Nav from '@/components/Nav';
import CompactMarkerRow from '@/components/CompactMarkerRow';
import LabsSort from '@/components/LabsSort';
import PrivacyToggle from '@/components/PrivacyToggle';
import PageHeader from '@/components/PageHeader';
import type { SortMode, FilterMode } from '@/components/LabsSort';
import type { LatestMarker } from '@/app/api/labs/latest-all/route';
import type { LabDraw } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { usePrivacy } from '@/context/PrivacyContext';
import { useProfileId, apiUrl } from '@/hooks/useProfileId';
import { fakeLabs, fakeLatestMarkers } from '@/lib/fake-persona';
import Link from 'next/link';

interface LatestAllResponse {
  markers: LatestMarker[];
  drawCount: number;
}

function LabsContent() {
  const [markerData, setMarkerData] = useState<LatestAllResponse | null>(null);
  const [draws, setDraws] = useState<LabDraw[] | null>(null);
  const [error, setError] = useState(false);
  const [sort, setSort] = useState<SortMode>('frequency');
  const [filter, setFilter] = useState<FilterMode>('all');
  const { isPrivate } = usePrivacy();
  const profileId = useProfileId();

  useEffect(() => {
    if (isPrivate) {
      setMarkerData(fakeLatestMarkers() as LatestAllResponse);
      setDraws([...fakeLabs].sort((a, b) => b.date.localeCompare(a.date)));
      setError(false);
      return;
    }
    setMarkerData(null);
    setDraws(null);
    setError(false);
    fetch(apiUrl('/api/labs/latest-all', profileId))
      .then(r => r.json())
      .then(setMarkerData)
      .catch(() => setError(true));
    fetch(apiUrl('/api/labs', profileId))
      .then(r => r.json())
      .then((d: LabDraw[]) => setDraws(d.sort((a, b) => b.date.localeCompare(a.date))))
      .catch(() => {});
  }, [isPrivate, profileId]);

  const markers = markerData?.markers ?? [];
  const drawCount = markerData?.drawCount ?? 0;
  const sortedDraws = draws ?? [];

  const processed = useMemo(() => {
    let filtered = [...markers];
    if (filter === 'flagged') filtered = filtered.filter(m => m.flag);
    if (filter === 'normal') filtered = filtered.filter(m => !m.flag);
    filtered.sort((a, b) => {
      switch (sort) {
        case 'date': return b.date.localeCompare(a.date);
        case 'name': return a.name.localeCompare(b.name);
        case 'flagged': {
          const w = (f?: string) => f === 'critical' ? 3 : f === 'high' ? 2 : f === 'low' ? 1 : 0;
          return w(b.flag) - w(a.flag) || b.historyCount - a.historyCount;
        }
        default: return b.historyCount !== a.historyCount ? b.historyCount - a.historyCount : a.name.localeCompare(b.name);
      }
    });
    return filtered;
  }, [markers, sort, filter]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-6">
      <PageHeader title="Labs">
        <PrivacyToggle />
      </PageHeader>
      {markers.length > 0 && (
        <div className="flex justify-end -mt-4">
          <span className="text-xs text-muted">{processed.length} markers</span>
        </div>
      )}
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
        <>
          <LabsSort sort={sort} filter={filter} onSortChange={setSort} onFilterChange={setFilter} />
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-xs text-muted mb-2 px-2">
              {processed.length} markers across {drawCount} draw{drawCount !== 1 ? 's' : ''}
            </p>
            <div className="space-y-px">
              {processed.map(m => (
                <CompactMarkerRow key={m.name} marker={m} date={m.date} historyCount={m.historyCount} />
              ))}
            </div>
          </div>
        </>
      )}
      {sortedDraws.length > 0 && (
        <>
          <div className="border-t border-border pt-4">
            <h2 className="text-sm font-medium text-muted mb-3">Lab Draws</h2>
          </div>
          <div className="space-y-3">
            {sortedDraws.map((draw, i) => {
              const flagged = draw.markers.filter(m => m.flag);
              return (
                <Link key={draw.date} href={`/labs/${draw.date}`}
                  className="block rounded-xl border border-border bg-card p-4 hover:bg-card-hover hover:border-border/80 transition-all duration-150 animate-in"
                  style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{formatDate(draw.date)}</p>
                      <p className="text-xs text-muted mt-0.5">
                        {draw.orderedBy && !draw.source.toLowerCase().includes(draw.orderedBy.toLowerCase())
                          ? `${draw.orderedBy} · ` : ''}{draw.source} · {draw.markers.length} markers
                      </p>
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
  );
}

export default function LabsPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <main className="flex-1 pb-20 md:pb-0">
        <Suspense fallback={
          <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-7 w-full rounded-lg" />
            ))}
          </div>
        }>
          <LabsContent />
        </Suspense>
      </main>
    </div>
  );
}
