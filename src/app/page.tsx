import Nav from '@/components/Nav';
import AlertBanner from '@/components/AlertBanner';
import ProfileCard from '@/components/ProfileCard';
import MedsCard from '@/components/MedsCard';
import SupplementsCard from '@/components/SupplementsCard';
import LabsCard from '@/components/LabsCard';
import PrivacyToggle from '@/components/PrivacyToggle';
import DashboardStats from '@/components/DashboardStats';
import ProfileSelector from '@/components/ProfileSelector';
import { kvGetProfileData, getProfileRegistry } from '@/lib/kv';
import type { Profile, Medication, Supplement, LabDraw } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function Dashboard({ searchParams }: { searchParams: { profileId?: string } }) {
  const profileId = searchParams.profileId || 'raj';
  
  // Validate profile ID exists
  const registry = await getProfileRegistry();
  const validProfile = registry.profiles.find(p => p.id === profileId);
  const activeProfileId = validProfile ? profileId : registry.defaultProfileId;

  const [profile, medications, supplements, labs] = await Promise.all([
    kvGetProfileData<Profile>('profile', activeProfileId),
    kvGetProfileData<Medication[]>('medications', activeProfileId),
    kvGetProfileData<Supplement[]>('supplements', activeProfileId),
    kvGetProfileData<LabDraw[]>('labs', activeProfileId),
  ]);

  // If no profile data in profile-specific storage, try to get from registry
  const displayProfile = profile || validProfile || null;

  const sortedLabs = labs?.sort((a, b) => b.date.localeCompare(a.date)) ?? null;
  const activeMeds = medications?.filter(m => m.status === 'current' || m.active).length ?? 0;
  const labCount = labs?.length ?? 0;
  const lastDraw = sortedLabs?.[0];

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <div className="flex-1 flex flex-col">
        <AlertBanner />
        <main className="flex-1 pb-20 md:pb-0">
          <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-6">
            <header className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-semibold tracking-tight">Health Overview</h1>
                  <PrivacyToggle />
                </div>
                <div className="flex items-center gap-3">
                  <ProfileSelector 
                    profiles={registry.profiles} 
                    currentProfileId={activeProfileId}
                  />
                  <DashboardStats
                    labCount={labCount}
                    activeMeds={activeMeds}
                    lastDrawDate={lastDraw?.date}
                  />
                </div>
              </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileCard profile={displayProfile} />
              <MedsCard medications={medications} />
              <SupplementsCard supplements={supplements} />
              <LabsCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
