import Nav from '@/components/Nav';
import ProviderCard from '@/components/ProviderCard';
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
          <h1 className="text-xl font-semibold tracking-tight">Care Team</h1>
          {providers.length === 0 ? (
            <p className="text-muted text-sm">No providers added yet</p>
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
