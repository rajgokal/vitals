import Nav from '@/components/Nav';
import ProvidersClient from '@/components/ProvidersClient';
import { kvGet } from '@/lib/kv';
import type { Provider } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function ProvidersPage() {
  const providers = await kvGet<Provider[]>('vitals:providers') ?? [];

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <main className="flex-1 pb-20 md:pb-0">
        <ProvidersClient providers={providers} />
      </main>
    </div>
  );
}
