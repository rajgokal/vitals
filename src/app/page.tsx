import Nav from '@/components/Nav';
import ProfileCard from '@/components/ProfileCard';
import MedsCard from '@/components/MedsCard';
import SupplementsCard from '@/components/SupplementsCard';
import LabsCard from '@/components/LabsCard';
import { kvGet } from '@/lib/kv';
import type { Profile, Medication, Supplement, LabDraw } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const [profile, medications, supplements, labs] = await Promise.all([
    kvGet<Profile>('vitals:profile'),
    kvGet<Medication[]>('vitals:medications'),
    kvGet<Supplement[]>('vitals:supplements'),
    kvGet<LabDraw[]>('vitals:labs'),
  ]);

  const sortedLabs = labs?.sort((a, b) => b.date.localeCompare(a.date)) ?? null;
  const activeMeds = medications?.filter(m => m.active).length ?? 0;
  const labCount = labs?.length ?? 0;
  const lastDraw = sortedLabs?.[0];

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-6">
          <header className="flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight">Health Overview</h1>
            <div className="flex gap-4 text-xs text-muted">
              <span>{labCount} lab draws</span>
              <span>{activeMeds} active meds</span>
              {lastDraw && <span>Last draw {lastDraw.date}</span>}
            </div>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfileCard profile={profile} />
            <MedsCard medications={medications} />
            <SupplementsCard supplements={supplements} />
            <LabsCard labs={sortedLabs} />
          </div>
        </div>
      </main>
    </div>
  );
}
