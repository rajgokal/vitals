'use client';

import { Suspense, useEffect, useState } from 'react';
import ProfileSelector from '@/components/ProfileSelector';
import { useProfileId } from '@/hooks/useProfileId';
import type { Profile, ProfileRegistry } from '@/lib/types';

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

function PageHeaderInner({ title, children }: PageHeaderProps) {
  const profileId = useProfileId();
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    fetch('/api/profiles')
      .then(r => r.json())
      .then((reg: ProfileRegistry) => setProfiles(reg.profiles))
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {children}
      </div>
      {profiles.length > 1 && (
        <div className="flex items-center gap-3 order-first md:order-none">
          <ProfileSelector profiles={profiles} currentProfileId={profileId} />
        </div>
      )}
    </div>
  );
}

export default function PageHeader(props: PageHeaderProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold tracking-tight">{props.title}</h1>
        {props.children}
      </div>
    }>
      <PageHeaderInner {...props} />
    </Suspense>
  );
}
