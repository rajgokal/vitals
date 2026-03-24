'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Nav from '@/components/Nav';
import LabDrawClient from '@/components/LabDrawClient';
import { useProfileId, apiUrl } from '@/hooks/useProfileId';
import type { LabDraw } from '@/lib/types';

function LabDrawContent() {
  const { date } = useParams<{ date: string }>();
  const profileId = useProfileId();
  const [draw, setDraw] = useState<LabDraw | null | undefined>(undefined);

  useEffect(() => {
    setDraw(undefined);
    fetch(apiUrl('/api/labs', profileId))
      .then(r => r.json())
      .then((labs: LabDraw[]) => { setDraw(labs.find(d => d.date === date) ?? null); })
      .catch(() => setDraw(null));
  }, [profileId, date]);

  if (draw === undefined) return (<div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-4">
    {Array.from({ length: 6 }).map((_, i) => (<div key={i} className="skeleton h-10 w-full rounded-lg" />))}
  </div>);
  if (draw === null) return (<div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
    <p className="text-muted text-sm">Lab draw not found for {date}</p>
  </div>);
  return <LabDrawClient draw={draw} />;
}

export default function LabDrawPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <main className="flex-1 pb-20 md:pb-0">
        <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (<div key={i} className="skeleton h-10 w-full rounded-lg" />))}
        </div>}>
          <LabDrawContent />
        </Suspense>
      </main>
    </div>
  );
}
