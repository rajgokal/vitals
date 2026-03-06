'use client';

import { useEffect, useState } from 'react';
import DashboardCard from './DashboardCard';
import MarkerRow from './MarkerRow';
import Link from 'next/link';
import type { LatestMarker } from '@/app/api/labs/latest-all/route';
import { usePrivacy } from '@/context/PrivacyContext';
import { fakeLatestMarkers } from '@/lib/fake-persona';

interface LatestAllResponse {
  markers: LatestMarker[];
  drawCount: number;
}

export default function LabsCard() {
  const [data, setData] = useState<LatestAllResponse | null>(null);
  const [error, setError] = useState(false);
  const { isPrivate } = usePrivacy();

  useEffect(() => {
    if (isPrivate) {
      setData(fakeLatestMarkers() as LatestAllResponse);
      setError(false);
      return;
    }

    fetch('/api/labs/latest-all')
      .then(r => r.json())
      .then(setData)
      .catch(() => setError(true));
  }, [isPrivate]);

  const markers = data?.markers ?? [];
  const drawCount = data?.drawCount ?? 0;
  const visible = markers.slice(0, 12);
  const remaining = markers.length - 12;

  return (
    <DashboardCard
      title="Latest Labs"
      className="md:col-span-2"
      action={<Link href="/labs" className="text-xs text-accent hover:underline">All draws</Link>}
    >
      {error ? (
        <p className="text-muted text-sm">Failed to load labs</p>
      ) : !data ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-10 w-full rounded-lg" />
          ))}
        </div>
      ) : markers.length === 0 ? (
        <p className="text-muted text-sm">No lab data yet</p>
      ) : (
        <>
          <p className="text-xs text-muted mb-3">
            {markers.length} markers across {drawCount} draw{drawCount !== 1 ? 's' : ''}
          </p>
          <div className="space-y-1">
            {visible.map(m => (
              <MarkerRow
                key={m.name}
                marker={m}
                date={m.date}
                historyCount={m.historyCount}
              />
            ))}
            {remaining > 0 && (
              <Link href="/labs" className="block text-xs text-accent hover:underline pt-1">
                +{remaining} more markers
              </Link>
            )}
          </div>
        </>
      )}
    </DashboardCard>
  );
}
