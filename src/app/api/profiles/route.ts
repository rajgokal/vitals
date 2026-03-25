import { NextRequest, NextResponse } from 'next/server';
import { getProfileRegistry, updateProfileRegistry, kvGetProfileData } from '@/lib/kv';
import { isAgentRequest } from '@/lib/api-helpers';
import type { Profile, ProfileRegistry } from '@/lib/types';

export async function GET() {
  try {
    const registry = await getProfileRegistry();
    return NextResponse.json(registry);
  } catch (error) {
    console.error('Failed to get profile registry:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAgentRequest(request)) {
    return NextResponse.json({ error: 'Agent key required' }, { status: 403 });
  }

  try {
    const body = await request.json() as { action: string; profile?: Profile; profileId?: string };
    const registry = await getProfileRegistry();

    switch (body.action) {
      case 'create':
        if (!body.profile) {
          return NextResponse.json({ error: 'Profile data required' }, { status: 400 });
        }
        
        // Check if profile ID already exists
        if (registry.profiles.some(p => p.id === body.profile!.id)) {
          return NextResponse.json({ error: 'Profile ID already exists' }, { status: 409 });
        }

        registry.profiles.push({
          ...body.profile,
          updatedAt: new Date().toISOString(),
        });
        await updateProfileRegistry(registry);
        return NextResponse.json({ ok: true, profile: body.profile });

      case 'update':
        if (!body.profile) {
          return NextResponse.json({ error: 'Profile data required' }, { status: 400 });
        }

        const updateIndex = registry.profiles.findIndex(p => p.id === body.profile!.id);
        if (updateIndex === -1) {
          return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        registry.profiles[updateIndex] = {
          ...body.profile,
          updatedAt: new Date().toISOString(),
        };
        await updateProfileRegistry(registry);
        return NextResponse.json({ ok: true, profile: body.profile });

      case 'delete':
        if (!body.profileId) {
          return NextResponse.json({ error: 'Profile ID required' }, { status: 400 });
        }

        // Cannot delete default profile
        if (body.profileId === registry.defaultProfileId) {
          return NextResponse.json({ error: 'Cannot delete default profile' }, { status: 400 });
        }

        const deleteIndex = registry.profiles.findIndex(p => p.id === body.profileId);
        if (deleteIndex === -1) {
          return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        registry.profiles.splice(deleteIndex, 1);
        await updateProfileRegistry(registry);
        return NextResponse.json({ ok: true, deletedProfileId: body.profileId });

      case 'switch':
        if (!body.profileId) {
          return NextResponse.json({ error: 'Profile ID required' }, { status: 400 });
        }

        if (!registry.profiles.some(p => p.id === body.profileId)) {
          return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // Update active status
        registry.profiles = registry.profiles.map(p => ({
          ...p,
          isActive: p.id === body.profileId,
        }));
        
        registry.defaultProfileId = body.profileId;
        await updateProfileRegistry(registry);
        return NextResponse.json({ ok: true, activeProfileId: body.profileId });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Profile operation failed:', error);
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}

// GET /api/profiles/summary - Get summary stats for all profiles
export async function GET_SUMMARY() {
  try {
    const registry = await getProfileRegistry();
    const summaries = await Promise.all(
      registry.profiles.map(async (profile) => {
        const [medications, labs, alerts] = await Promise.all([
          kvGetProfileData('medications', profile.id),
          kvGetProfileData('labs', profile.id),
          kvGetProfileData('alerts', profile.id),
        ]);

        return {
          profileId: profile.id,
          name: profile.name,
          lastUpdated: profile.updatedAt,
          stats: {
            medications: Array.isArray(medications) ? medications.length : 0,
            labs: Array.isArray(labs) ? labs.length : 0,
            alerts: (Array.isArray(alerts) && alerts.length > 0) ? alerts.filter((a: any) => a.status === 'active').length : 0,
          },
        };
      })
    );

    return NextResponse.json({
      profiles: summaries,
      activeProfileId: registry.defaultProfileId,
    });
  } catch (error) {
    console.error('Failed to get profile summaries:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}