import Nav from '@/components/Nav';
import ProviderCard from '@/components/ProviderCard';
import PrivacyToggle from '@/components/PrivacyToggle';
import { kvGet } from '@/lib/kv';
import type { Provider } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function ProvidersPage() {
  const providers = await kvGet<Provider[]>('vitals:providers') ?? [];

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold tracking-tight">Care Team</h1>
              <PrivacyToggle />
            </div>
            {providers.length > 0 && (
              <span className="text-xs text-muted">{providers.length} provider{providers.length !== 1 ? 's' : ''}</span>
            )}
          </div>
          {providers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
              <p className="text-muted text-sm">No providers added yet</p>
              <p className="text-xs text-muted mt-1">Your care team will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {providers.map(p => (
                <ProviderCard key={p.name} provider={p} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
