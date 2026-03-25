'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useProfileId(): string {
  const searchParams = useSearchParams();
  const [profileId, setProfileId] = useState<string>('raj'); // Default to 'raj'
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    // Mark as hydrated on first effect run
    setIsHydrated(true);
    
    try {
      // Only update after hydration to prevent server/client mismatch
      const paramValue = searchParams.get('profileId') || 'raj';
      setProfileId(paramValue);
    } catch (error) {
      console.warn('Error reading profileId from search params:', error);
      // Fallback to default if there's any error
      setProfileId('raj');
    }
  }, [searchParams]);
  
  // During SSR and initial hydration, always return 'raj' to prevent mismatches
  if (!isHydrated) {
    return 'raj';
  }
  
  return profileId;
}

export function apiUrl(path: string, profileId: string): string {
  const sep = path.includes('?') ? '&' : '?';
  if (profileId === 'raj') return path;
  return `${path}${sep}profileId=${encodeURIComponent(profileId)}`;
}
