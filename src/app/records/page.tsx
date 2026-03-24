'use client';

import { Suspense, useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import PageHeader from '@/components/PageHeader';
import PrivacyToggle from '@/components/PrivacyToggle';
import { useProfileId, apiUrl } from '@/hooks/useProfileId';
import type { MedicalRecord } from '@/lib/types';
import RecordsClient from './RecordsClient';

function RecordsContent() {
  const profileId = useProfileId();
  const [records, setRecords] = useState<MedicalRecord[] | null>(null);

  useEffect(() => {
    setRecords(null);
    fetch(apiUrl('/api/records', profileId))
      .then(r => r.json())
      .then((raw: unknown) => {
        const arr = Array.isArray(raw) ? raw : [];
        const valid = arr.filter(
          (r): r is MedicalRecord =>
            r != null && typeof r === 'object' && !Array.isArray(r) && typeof (r as Record<string, unknown>).id === 'string'
        );
        valid.sort((a, b) => {
          const dateA = a.dateRange?.end ?? a.dateRange?.start ?? a.uploadedAt ?? '';
          const dateB = b.dateRange?.end ?? b.dateRange?.start ?? b.uploadedAt ?? '';
          return dateB.localeCompare(dateA);
        });
        setRecords(valid);
      })
      .catch(() => setRecords([]));
  }, [profileId]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Records"><PrivacyToggle /></PageHeader>
        {records && (<span className="text-xs text-muted">{records.length} document{records.length !== 1 ? 's' : ''}</span>)}
      </div>
      {records === null ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => (<div key={i} className="skeleton h-16 w-full rounded-xl" />))}</div>
      ) : records.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
          <p className="text-muted text-sm">No records ingested yet</p>
          <p className="text-xs text-muted mt-1">Medical records will appear here as they are processed</p>
        </div>
      ) : (<RecordsClient records={records} />)}
    </div>
  );
}

export default function RecordsPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <main className="flex-1 pb-20 md:pb-0">
        <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (<div key={i} className="skeleton h-16 w-full rounded-xl" />))}
        </div>}>
          <RecordsContent />
        </Suspense>
      </main>
    </div>
  );
}
