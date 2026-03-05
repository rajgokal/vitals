'use client';

import type { Profile } from '@/lib/types';
import DashboardCard from './DashboardCard';
import { usePrivacy } from '@/context/PrivacyContext';
import { anonymizeName, anonymizeAge } from '@/lib/anonymize';

interface ProfileCardProps {
  profile: Profile | null;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const { isPrivate } = usePrivacy();

  if (!profile) {
    return (
      <DashboardCard title="Profile">
        <p className="text-muted text-sm">No profile data yet</p>
      </DashboardCard>
    );
  }

  const displayName = isPrivate ? anonymizeName(profile.name) : profile.name;
  const displayAge = isPrivate ? anonymizeAge(profile.age) : `${profile.age}y`;

  return (
    <DashboardCard title="Profile" className="md:col-span-2">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-accent-dim flex items-center justify-center text-accent text-lg font-semibold">
          {profile.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold transition-all duration-200">{displayName}</h3>
          <p className="text-sm text-muted transition-all duration-200">
            {displayAge} · {profile.sex} · {profile.bodyMetrics.height} · {profile.bodyMetrics.weight}
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {profile.conditions.length > 0 && (
          <div>
            <p className="text-xs text-muted mb-1.5">Conditions</p>
            <div className="flex flex-wrap gap-1.5">
              {profile.conditions.map(c => (
                <span key={c} className="px-2 py-0.5 text-xs rounded-full bg-warning/10 text-warning border border-warning/20">{c}</span>
              ))}
            </div>
          </div>
        )}
        {profile.allergies.length > 0 && (
          <div>
            <p className="text-xs text-muted mb-1.5">Allergies</p>
            <div className="flex flex-wrap gap-1.5">
              {profile.allergies.map(a => (
                <span key={a} className="px-2 py-0.5 text-xs rounded-full bg-critical/10 text-critical border border-critical/20">{a}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
