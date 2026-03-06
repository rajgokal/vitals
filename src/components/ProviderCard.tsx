'use client';

import type { Provider } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface ProviderCardProps {
  provider: Provider;
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  const displayVisit = provider.lastVisit ? formatDate(provider.lastVisit) : null;

  return (
    <div className="rounded-xl border border-border bg-card p-4 hover:bg-card-hover transition-colors duration-150 animate-in">
      <h3 className="text-sm font-semibold transition-all duration-200">{provider.name}</h3>
      {(provider.role || provider.specialty) && (
        <p className="text-xs text-accent mt-0.5">{provider.role || provider.specialty}</p>
      )}
      {(provider.practice || provider.facility) && (
        <p className="text-xs text-muted mt-1">{provider.practice || provider.facility}</p>
      )}
      {provider.address && (
        <p className="text-xs text-muted mt-1">{provider.address}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted transition-all duration-200">
        {provider.phone && (
          <a href={`tel:${provider.phone}`} className="hover:text-foreground transition-colors">
            📞 {provider.phone}
          </a>
        )}
        {provider.email && (
          <a href={`mailto:${provider.email}`} className="hover:text-foreground transition-colors">
            ✉ {provider.email}
          </a>
        )}
        {displayVisit && <span>Last: {displayVisit}</span>}
      </div>
    </div>
  );
}
