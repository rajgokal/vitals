'use client';

import type { Provider } from '@/lib/types';
import ProviderCard from './ProviderCard';
import PrivacyToggle from './PrivacyToggle';
import PageHeader from './PageHeader';
import { usePrivacy } from '@/context/PrivacyContext';
import { fakeProviders } from '@/lib/fake-persona';

interface ProvidersClientProps {
  providers: Provider[];
}

export default function ProvidersClient({ providers }: ProvidersClientProps) {
  const { isPrivate } = usePrivacy();
  const data = isPrivate ? fakeProviders : providers;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Care Team">
          <PrivacyToggle />
        </PageHeader>
        {data.length > 0 && (
          <span className="text-xs text-muted">{data.length} provider{data.length !== 1 ? 's' : ''}</span>
        )}
      </div>
      {data.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
          <p className="text-muted text-sm">No providers added yet</p>
          <p className="text-xs text-muted mt-1">Your care team will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.map(p => (
            <ProviderCard key={p.name} provider={p} />
          ))}
        </div>
      )}
    </div>
  );
}
