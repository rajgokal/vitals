'use client';

import { Suspense, useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import ProvidersClient from '@/components/ProvidersClient';
import { useProfileId, apiUrl } from '@/hooks/useProfileId';
import type { Provider } from '@/lib/types';

function ProvidersContent() {
  const profileId = useProfileId();
  const [providers, setProviders] = useState<Provider[] | null>(null);

  useEffect(() => {
    setProviders(null);
    fetch(apiUrl('/api/providers', profileId))
      .then(r => r.json())
      .then((data: Provider[]) => setProviders(data ?? []))
      .catch(() => setProviders([]));
  }, [profileId]);

  if (providers === null) {
    return (<div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (<div key={i} className="skeleton h-16 w-full rounded-xl" />))}
    </div>);
  }
  return <ProvidersClient providers={providers} />;
}

export default function ProvidersPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <main className="flex-1 pb-20 md:pb-0">
        <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (<div key={i} className="skeleton h-16 w-full rounded-xl" />))}
        </div>}>
          <ProvidersContent />
        </Suspense>
      </main>
    </div>
  );
}
