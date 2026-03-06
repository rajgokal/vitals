import Nav from '@/components/Nav';
import GeneticsClient from '@/components/GeneticsClient';
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
        <GeneticsClient genetics={genetics} interactions={interactions} />
      </main>
    </div>
  );
}
