import { createClient } from '@vercel/kv';
import type { ProfileRegistry } from './types';

const kv = createClient({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
});

export async function kvGet<T>(key: string): Promise<T | null> {
  try {
    return await kv.get<T>(key);
  } catch {
    return null;
  }
}

export async function kvSet<T>(key: string, value: T): Promise<void> {
  await kv.set(key, value);
}

export async function kvDel(key: string): Promise<void> {
  await kv.del(key);
}

// Profile-aware KV operations
export async function getProfileRegistry(): Promise<ProfileRegistry> {
  const registry = await kvGet<ProfileRegistry>('vitals:profiles');
  
  if (registry) {
    return registry;
  }
  
  // Create default registry with all profiles as per spec
  const now = new Date().toISOString();
  const defaultRegistry: ProfileRegistry = {
    profiles: [
      {
        id: 'raj',
        name: 'Raj Gokal',
        dob: '1988-06-06',
        age: 37,
        sex: 'Male',
        conditions: [],
        allergies: [],
        bodyMetrics: { height: '', weight: '' },
        geneticFlags: [],
        updatedAt: now,
        isActive: true,
        relationship: 'self',
        avatar: null,
        color: '#4F46E5',
        isDefault: true,
        isDemo: false,
        createdAt: now,
      },
      {
        id: 'shivani',
        name: 'Shivani Gokal', 
        dob: '1988-08-05',
        age: 37,
        sex: 'Female',
        conditions: [],
        allergies: [],
        bodyMetrics: { height: '', weight: '' },
        geneticFlags: [],
        updatedAt: now,
        isActive: false,
        relationship: 'spouse',
        avatar: null,
        color: '#EC4899',
        isDefault: false,
        isDemo: false,
        createdAt: now,
      },
      {
        id: 'arya',
        name: 'Arya Gokal',
        dob: '2023-02-25', 
        age: 3,
        sex: 'Female',
        conditions: [],
        allergies: [],
        bodyMetrics: { height: '', weight: '' },
        geneticFlags: [],
        updatedAt: now,
        isActive: false,
        relationship: 'daughter',
        avatar: null,
        color: '#F59E0B',
        isDefault: false,
        isDemo: false,
        pediatric: true,
        createdAt: now,
      },
      {
        id: 'privacy',
        name: 'Blueprint Demo',
        dob: '',
        age: 0,
        sex: '',
        conditions: [],
        allergies: [],
        bodyMetrics: { height: '', weight: '' },
        geneticFlags: [],
        updatedAt: now,
        isActive: false,
        relationship: 'demo',
        avatar: null,
        color: '#6B7280',
        isDefault: false,
        isDemo: true,
        createdAt: now,
      },
    ],
    defaultProfileId: 'raj',
    lastUpdated: now,
  };
  
  // Save the default registry
  await updateProfileRegistry(defaultRegistry);
  return defaultRegistry;
}

export async function updateProfileRegistry(registry: ProfileRegistry): Promise<void> {
  await kvSet('vitals:profiles', { ...registry, lastUpdated: new Date().toISOString() });
}

export async function validateProfileId(profileId: string): Promise<boolean> {
  const registry = await getProfileRegistry();
  return registry.profiles.some(p => p.id === profileId);
}

export function getProfileDataKey(dataType: string, profileId: string): string {
  return `vitals:data:${profileId}:${dataType}`;
}

export async function kvGetProfileData<T>(dataType: string, profileId: string): Promise<T | null> {
  const key = getProfileDataKey(dataType, profileId);
  return await kvGet<T>(key);
}

export async function kvSetProfileData<T>(dataType: string, profileId: string, value: T): Promise<void> {
  const key = getProfileDataKey(dataType, profileId);
  await kvSet(key, value);
}

export async function kvDelProfileData(dataType: string, profileId: string): Promise<void> {
  const key = getProfileDataKey(dataType, profileId);
  await kvDel(key);
}

export { kv };
