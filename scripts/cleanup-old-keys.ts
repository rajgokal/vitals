#!/usr/bin/env node

/**
 * Cleanup script to remove old single-profile keys after successful migration
 * 
 * ⚠️  DANGER: This will permanently delete the old keys!
 * Only run after verifying the migration worked correctly.
 * 
 * Run: npx tsx scripts/cleanup-old-keys.ts
 */

import { createClient } from '@vercel/kv';

const kv = createClient({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
});

const OLD_KEYS = [
  'vitals:profile',
  'vitals:medications', 
  'vitals:supplements',
  'vitals:labs',
  'vitals:alerts',
  'vitals:providers',
  'vitals:interactions',
  'vitals:records',
  'vitals:genetics',
  'vitals:immunizations',
  'vitals:encounters',
  'vitals:wearables'
];

async function cleanupOldKeys() {
  console.log('🧹 Starting cleanup of old single-profile keys...');
  console.log('⚠️  WARNING: This will permanently delete old data keys!');
  
  // Wait 5 seconds for user to cancel
  console.log('   Press Ctrl+C to cancel. Starting in 5 seconds...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  const results: { [key: string]: boolean } = {};

  for (const key of OLD_KEYS) {
    console.log(`🗑️  Deleting ${key}...`);
    
    try {
      // Check if key exists first
      const exists = await kv.get(key);
      if (exists === null) {
        console.log(`   ⏭️  ${key} doesn't exist, skipping`);
        results[key] = true;
        continue;
      }

      // Delete the key
      await kv.del(key);
      console.log(`   ✅ Deleted ${key}`);
      results[key] = true;

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`   ❌ Failed to delete ${key}:`, error);
      results[key] = false;
    }
  }

  // Report results
  console.log('\n📊 Cleanup Results:');
  const successful = Object.entries(results).filter(([_, success]) => success);
  const failed = Object.entries(results).filter(([_, success]) => !success);

  console.log(`✅ Successfully deleted: ${successful.length} keys`);
  successful.forEach(([key]) => console.log(`   - ${key}`));

  if (failed.length > 0) {
    console.log(`❌ Failed to delete: ${failed.length} keys`);
    failed.forEach(([key]) => console.log(`   - ${key}`));
  }

  if (failed.length === 0) {
    console.log('\n🎉 Cleanup complete! Old single-profile keys have been removed.');
  } else {
    console.log('\n⚠️  Cleanup incomplete - some keys failed to delete');
    process.exit(1);
  }
}

// Run cleanup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanupOldKeys();
}

export { cleanupOldKeys };