import Nav from '@/components/Nav';
import GeneticsPanel from '@/components/GeneticsPanel';
import InteractionsTable from '@/components/InteractionsTable';
import { kvGet } from '@/lib/kv';
import type { GeneticsPanel as GeneticsPanelType, Interaction } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function GeneticsPage() {
  const [genetics, interactions] = await Promise.all([
    kvGet<GeneticsPanelType>('vitals:genetics'),
    kvGet<Interaction[]>('vitals:interactions'),
  ]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-6">
          <h1 className="text-xl font-semibold tracking-tight">Genetics & Interactions</h1>
          <GeneticsPanel genetics={genetics} />
          <InteractionsTable interactions={interactions} />
        </div>
      </main>
    </div>
  );
}
