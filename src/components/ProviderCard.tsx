import type { Provider } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface ProviderCardProps {
  provider: Provider;
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 hover:bg-card-hover animate-in">
      <h3 className="text-sm font-semibold">{provider.name}</h3>
      <p className="text-xs text-accent mt-0.5">{provider.specialty}</p>
      {provider.facility && <p className="text-xs text-muted mt-1">{provider.facility}</p>}
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted">
        {provider.phone && <span>📞 {provider.phone}</span>}
        {provider.email && <span>✉ {provider.email}</span>}
        {provider.lastVisit && <span>Last: {formatDate(provider.lastVisit)}</span>}
      </div>
    </div>
  );
}
