import { kvGet, kvSet, kvDel, kvSetProfileData } from './kv';

export interface MigrationResult {
  migrated: string[];
  skipped: string[];
  errors: string[];
}

const LEGACY_KEYS_TO_MIGRATE = [
  'vitals:medications',
  'vitals:supplements', 
  'vitals:labs',
  'vitals:genetics',
  'vitals:providers',
  'vitals:records',
  'vitals:interactions',
  'vitals:immunizations',
  'vitals:encounters',
  'vitals:alerts'
];

export async function migrateLegacyDataToProfiles(): Promise<MigrationResult> {
  const result: MigrationResult = {
    migrated: [],
    skipped: [],
    errors: []
  };

  for (const legacyKey of LEGACY_KEYS_TO_MIGRATE) {
    try {
      const data = await kvGet(legacyKey);
      
      if (data === null || data === undefined) {
        result.skipped.push(`${legacyKey} (no data)`);
        continue;
      }

      // Extract the data type from the key (e.g., 'vitals:medications' -> 'medications')
      const dataType = legacyKey.split(':')[1];
      
      // Migrate data to raj profile (default)
      await kvSetProfileData(dataType, 'raj', data);
      
      // Delete the legacy key after successful migration
      await kvDel(legacyKey);
      
      result.migrated.push(legacyKey);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      result.errors.push(`${legacyKey}: ${errorMessage}`);
    }
  }

  return result;
}

export async function checkLegacyDataExists(): Promise<string[]> {
  const existingKeys: string[] = [];
  
  for (const legacyKey of LEGACY_KEYS_TO_MIGRATE) {
    try {
      const data = await kvGet(legacyKey);
      if (data !== null && data !== undefined) {
        existingKeys.push(legacyKey);
      }
    } catch {
      // Ignore errors when checking for existence
    }
  }
  
  return existingKeys;
}