'use client';

import { Suspense, useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import MedicationsClient from '@/components/MedicationsClient';
import PageHeader from '@/components/PageHeader';
import { useProfileId, apiUrl } from '@/hooks/useProfileId';
import { usePrivacy } from '@/context/PrivacyContext';
import type { Medication } from '@/lib/types';

function MedicationsContent() {
  const profileId = useProfileId();
  const { isPrivate } = usePrivacy();
  const [medications, setMedications] = useState<Medication[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isPrivate) { setMedications([]); return; }
    setMedications(null);
    setError(false);
    fetch(apiUrl('/api/medications', profileId))
      .then(r => r.json())
      .then((data: Medication[]) => setMedications(data ?? []))
      .catch(() => setError(true));
  }, [profileId, isPrivate]);

  const active = medications?.filter(m => m.status === 'current' || m.active) ?? [];
  const historical = medications?.filter(m => m.status === 'stopped' || (m.active === false && m.status !== 'current')) ?? [];

  if (!medications && !error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-4">
        <PageHeader title="Medications" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
        <PageHeader title="Medications" />
        <p className="text-muted text-sm mt-4">Failed to load medications</p>
      </div>
    );
  }
  return <MedicationsClient active={active} historical={historical} />;
}

export default function MedicationsPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <main className="flex-1 pb-20 md:pb-0">
        <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (<div key={i} className="skeleton h-16 w-full rounded-xl" />))}
        </div>}>
          <MedicationsContent />
        </Suspense>
      </main>
    </div>
  );
}
