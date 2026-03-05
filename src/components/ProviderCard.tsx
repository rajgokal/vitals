'use client';

import type { Provider } from '@/lib/types';
import { formatDate, relativeDate } from '@/lib/utils';
import { usePrivacy } from '@/context/PrivacyContext';
import { anonymizeProviderName } from '@/lib/anonymize';

interface ProviderCardProps {
  provider: Provider;
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  const { isPrivate } = usePrivacy();

  const displayName = isPrivate
    ? anonymizeProviderName(provider)
    : provider.name;
  const displaySubtitle = isPrivate ? null : (provider.role || provider.specialty);
  const displayVisit = provider.lastVisit
    ? (isPrivate ? relativeDate(provider.lastVisit) : formatDate(provider.lastVisit))
    : null;

  return (
    <div className="rounded-xl border border-border bg-card p-4 hover:bg-card-hover transition-colors duration-150 animate-in">
      <h3 className="text-sm font-semibold transition-all duration-200">{displayName}</h3>
      {!isPrivate && displaySubtitle && (
        <p className="text-xs text-accent mt-0.5">{displaySubtitle}</p>
      )}
      {!isPrivate && (provider.practice || provider.facility) && (
        <p className="text-xs text-muted mt-1">{provider.practice || provider.facility}</p>
      )}
      {!isPrivate && provider.address && (
        <p className="text-xs text-muted mt-1">{provider.address}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted transition-all duration-200">
        {!isPrivate && provider.phone && (
          <a href={`tel:${provider.phone}`} className="hover:text-foreground transition-colors">
            📞 {provider.phone}
          </a>
        )}
        {!isPrivate && provider.email && (
          <a href={`mailto:${provider.email}`} className="hover:text-foreground transition-colors">
            ✉ {provider.email}
          </a>
        )}
        {displayVisit && <span>Last: {displayVisit}</span>}
      </div>
    </div>
  );
}
