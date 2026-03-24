'use client';

import { useSearchParams } from 'next/navigation';

export function useProfileId(): string {
  const searchParams = useSearchParams();
  return searchParams.get('profileId') || 'raj';
}

export function apiUrl(path: string, profileId: string): string {
  const sep = path.includes('?') ? '&' : '?';
  if (profileId === 'raj') return path;
  return `${path}${sep}profileId=${encodeURIComponent(profileId)}`;
}
