#!/usr/bin/env node

/**
 * Migration script to move existing single-profile data to multi-profile structure
 * 
 * Before: vitals:medications -> Medication[]
 * After: vitals:data:raj:medications -> Medication[]
 * 
 * Run: npx tsx scripts/migrate-to-profiles.ts
 */

import { createClient } from '@vercel/kv';
import type { Profile, ProfileRegistry } from '../src/lib/types';

const kv = createClient({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
});

const DATA_TYPES = [
  'profile',
  'medications', 
  'supplements',
  'labs',
  'alerts',
  'providers',
  'interactions',
  'records',
  'genetics',
  'immunizations',
  'encounters',
  'wearables'
];

async function migrateData() {
  console.log('🚀 Starting migration to profile-scoped data...');

  try {
    // Step 1: Create profile registry with default "raj" profile
    const existingRegistry = await kv.get<ProfileRegistry>('vitals:profiles');
    
    if (existingRegistry) {
      console.log('✅ Profile registry already exists, skipping creation');
    } else {
      console.log('📝 Creating profile registry...');
      
      // Try to get existing profile data to populate raj profile
      const existingProfile = await kv.get<any>('vitals:profile');
      
      const rajProfile: Profile = {
        id: 'raj',
        name: existingProfile?.name || 'Raj Gokal',
        dob: existingProfile?.dob || '1988-06-06',
        age: existingProfile?.age || 37,
        sex: existingProfile?.sex || 'Male',
        conditions: existingProfile?.conditions || [],
        allergies: existingProfile?.allergies || [],
        bodyMetrics: existingProfile?.bodyMetrics || { height: '', weight: '' },
        geneticFlags: existingProfile?.geneticFlags || [],
        updatedAt: new Date().toISOString(),
        isActive: true,
      };

      const registry: ProfileRegistry = {
        profiles: [rajProfile],
        defaultProfileId: 'raj',
        lastUpdated: new Date().toISOString(),
      };

      await kv.set('vitals:profiles', registry);
      console.log('✅ Created profile registry with raj profile');
    }

    // Step 2: Migrate all data types to profile-scoped keys
    const migrationResults: { [key: string]: boolean } = {};

    for (const dataType of DATA_TYPES) {
      const oldKey = `vitals:${dataType}`;
      const newKey = `vitals:data:raj:${dataType}`;

      console.log(`📦 Migrating ${dataType}...`);

      try {
        // Check if new key already exists (skip if already migrated)
        const existingNewData = await kv.get(newKey);
        if (existingNewData !== null) {
          console.log(`   ⏭️  ${dataType} already migrated, skipping`);
          migrationResults[dataType] = true;
          continue;
        }

        // Get old data
        const oldData = await kv.get(oldKey);
        
        if (oldData === null) {
          console.log(`   ⚠️  No data found for ${dataType}, skipping`);
          migrationResults[dataType] = true;
          continue;
        }

        // Set new data
        await kv.set(newKey, oldData);
        console.log(`   ✅ Migrated ${dataType} data`);
        migrationResults[dataType] = true;

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`   ❌ Failed to migrate ${dataType}:`, error);
        migrationResults[dataType] = false;
      }
    }

    // Step 3: Report results
    console.log('\n📊 Migration Results:');
    const successful = Object.entries(migrationResults).filter(([_, success]) => success);
    const failed = Object.entries(migrationResults).filter(([_, success]) => !success);

    console.log(`✅ Successfully migrated: ${successful.length} data types`);
    successful.forEach(([dataType]) => console.log(`   - ${dataType}`));

    if (failed.length > 0) {
      console.log(`❌ Failed to migrate: ${failed.length} data types`);
      failed.forEach(([dataType]) => console.log(`   - ${dataType}`));
    }

    // Step 4: Verify migration
    console.log('\n🔍 Verifying migration...');
    let allVerified = true;

    for (const dataType of DATA_TYPES) {
      const newKey = `vitals:data:raj:${dataType}`;
      const newData = await kv.get(newKey);
      
      if (migrationResults[dataType] && newData === null) {
        console.error(`❌ Verification failed: ${dataType} data missing after migration`);
        allVerified = false;
      }
    }

    if (allVerified) {
      console.log('✅ Migration verification successful');
      console.log('\n🎉 Migration complete! The app now supports multi-profile data.');
      console.log('\n⚠️  IMPORTANT: Old data keys are still present for rollback safety.');
      console.log('   Run cleanup script after confirming everything works correctly.');
    } else {
      console.log('❌ Migration verification failed - please check logs above');
      process.exit(1);
    }

  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateData();
}

export { migrateData };