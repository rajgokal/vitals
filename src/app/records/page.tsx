import Nav from '@/components/Nav';
import { kvGet } from '@/lib/kv';
import type { MedicalRecord } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import RecordsClient from './RecordsClient';

export const dynamic = 'force-dynamic';

export default async function RecordsPage() {
  const records = await kvGet<MedicalRecord[]>('vitals:records') ?? [];
  records.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-6">
          <header className="flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight">Records</h1>
            <span className="text-xs text-muted">{records.length} document{records.length !== 1 ? 's' : ''}</span>
          </header>

          {records.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
              <p className="text-muted text-sm">No records ingested yet</p>
              <p className="text-xs text-muted mt-1">Medical records will appear here as they are processed</p>
            </div>
          ) : (
            <RecordsClient records={records} />
          )}
        </div>
      </main>
    </div>
  );
}
