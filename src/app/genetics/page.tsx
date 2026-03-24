'use client';

import { Suspense, useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import GeneticsClient from '@/components/GeneticsClient';
import { useProfileId, apiUrl } from '@/hooks/useProfileId';
import type { GeneticsPanel as GeneticsPanelType, Interaction } from '@/lib/types';

function GeneticsContent() {
  const profileId = useProfileId();
  const [genetics, setGenetics] = useState<GeneticsPanelType | null | undefined>(undefined);
  const [interactions, setInteractions] = useState<Interaction[] | null>(null);

  useEffect(() => {
    setGenetics(undefined);
    setInteractions(null);
    fetch(apiUrl('/api/genetics', profileId)).then(r => r.json()).then(setGenetics).catch(() => setGenetics(null));
    fetch(apiUrl('/api/interactions', profileId)).then(r => r.json()).then((d: Interaction[]) => setInteractions(d ?? [])).catch(() => setInteractions([]));
  }, [profileId]);

  if (genetics === undefined) {
    return (<div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (<div key={i} className="skeleton h-16 w-full rounded-xl" />))}
    </div>);
  }
  return <GeneticsClient genetics={genetics} interactions={interactions} />;
}

export default function GeneticsPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <main className="flex-1 pb-20 md:pb-0">
        <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (<div key={i} className="skeleton h-16 w-full rounded-xl" />))}
        </div>}>
          <GeneticsContent />
        </Suspense>
      </main>
    </div>
  );
}
