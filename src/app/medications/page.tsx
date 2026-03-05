import Nav from '@/components/Nav';
import MedicationsClient from '@/components/MedicationsClient';
import { kvGet } from '@/lib/kv';
import type { Medication } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function MedicationsPage() {
  const medications = await kvGet<Medication[]>('vitals:medications') ?? [];
  const active = medications.filter(m => m.status === 'current' || m.active);
  const historical = medications.filter(m => m.status === 'stopped' || (m.active === false && m.status !== 'current'));

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <main className="flex-1 pb-20 md:pb-0">
        <MedicationsClient active={active} historical={historical} />
      </main>
    </div>
  );
}
