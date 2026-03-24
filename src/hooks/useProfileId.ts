'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useProfileId(): string {
  const searchParams = useSearchParams();
  const [profileId, setProfileId] = useState('raj'); // Default to 'raj' for initial render
  
  useEffect(() => {
    // Only update after hydration
    const paramValue = searchParams.get('profileId') || 'raj';
    setProfileId(paramValue);
  }, [searchParams]);
  
  return profileId;
}

export function apiUrl(path: string, profileId: string): string {
  const sep = path.includes('?') ? '&' : '?';
  if (profileId === 'raj') return path;
  return `${path}${sep}profileId=${encodeURIComponent(profileId)}`;
}
