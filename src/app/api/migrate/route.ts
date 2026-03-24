import { NextRequest, NextResponse } from 'next/server';
import { isAgentRequest } from '@/lib/api-helpers';
import { migrateLegacyDataToProfiles, checkLegacyDataExists } from '@/lib/migration';

export async function GET() {
  try {
    const existingKeys = await checkLegacyDataExists();
    return NextResponse.json({
      needsMigration: existingKeys.length > 0,
      legacyKeysFound: existingKeys,
      message: existingKeys.length > 0 
        ? 'Legacy data found. Use POST /api/migrate to perform migration.'
        : 'No legacy data found. Migration not needed.'
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAgentRequest(request)) {
    return NextResponse.json({ error: 'Agent key required' }, { status: 403 });
  }

  try {
    const result = await migrateLegacyDataToProfiles();
    
    const statusCode = result.errors.length > 0 ? 207 : 200; // 207 Multi-Status if partial errors
    
    return NextResponse.json({
      ok: true,
      migration: result,
      summary: {
        migrated: result.migrated.length,
        skipped: result.skipped.length,
        errors: result.errors.length
      }
    }, { status: statusCode });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: 'Migration failed',
      details: message 
    }, { status: 500 });
  }
}