'use client';

import { Suspense, useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import AlertBanner from '@/components/AlertBanner';
import ProfileCard from '@/components/ProfileCard';
import MedsCard from '@/components/MedsCard';
import SupplementsCard from '@/components/SupplementsCard';
import LabsCard from '@/components/LabsCard';
import PrivacyToggle from '@/components/PrivacyToggle';
import DashboardStats from '@/components/DashboardStats';
import PageHeader from '@/components/PageHeader';
import { useProfileId, apiUrl } from '@/hooks/useProfileId';
import type { Profile, Medication, Supplement, LabDraw, ProfileRegistry } from '@/lib/types';

function DashboardContent() {
  const profileId = useProfileId();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [medications, setMedications] = useState<Medication[] | null>(null);
  const [supplements, setSupplements] = useState<Supplement[] | null>(null);
  const [labs, setLabs] = useState<LabDraw[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const profilePromise = fetch('/api/profiles')
      .then(r => r.json())
      .then((reg: ProfileRegistry) => {
        const p = reg.profiles.find(pr => pr.id === profileId);
        setProfile(p || null);
      })
      .catch(() => setProfile(null));

    const medsPromise = fetch(apiUrl('/api/medications', profileId))
      .then(r => r.json())
      .then((data: Medication[]) => setMedications(data ?? []))
      .catch(() => setMedications([]));

    const supplementsPromise = fetch(apiUrl('/api/supplements', profileId))
      .then(r => r.json())
      .then((data: Supplement[]) => setSupplements(data ?? []))
      .catch(() => setSupplements([]));

    const labsPromise = fetch(apiUrl('/api/labs', profileId))
      .then(r => r.json())
      .then((data: LabDraw[]) => setLabs(data ?? []))
      .catch(() => setLabs([]));

    Promise.all([profilePromise, medsPromise, supplementsPromise, labsPromise])
      .finally(() => setLoading(false));
  }, [profileId]);

  const sortedLabs = labs?.sort((a, b) => b.date.localeCompare(a.date)) ?? null;
  const activeMeds = medications?.filter(m => m.status === 'current' || m.active).length ?? 0;
  const labCount = labs?.length ?? 0;
  const lastDraw = sortedLabs?.[0];

  return (
    <>
      <header className="space-y-4">
        <PageHeader title="Health Overview">
          <PrivacyToggle />
        </PageHeader>
        {!loading && (
          <>
            <div className="hidden md:flex justify-end -mt-2">
              <DashboardStats labCount={labCount} activeMeds={activeMeds} lastDrawDate={lastDraw?.date} />
            </div>
            <div className="md:hidden">
              <DashboardStats labCount={labCount} activeMeds={activeMeds} lastDrawDate={lastDraw?.date} />
            </div>
          </>
        )}
      </header>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileCard profile={profile} />
          <MedsCard medications={medications} />
          <SupplementsCard supplements={supplements} />
          <LabsCard />
        </div>
      )}
    </>
  );
}

export default function Dashboard() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <div className="flex-1 flex flex-col">
        <AlertBanner />
        <main className="flex-1 pb-20 md:pb-0">
          <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-6">
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton h-40 w-full rounded-xl" />
                ))}
              </div>
            }>
              <DashboardContent />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
