'use client';

import { useState } from 'react';
import type { MedicalRecord } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { usePrivacy } from '@/context/PrivacyContext';
import { fakeRecords } from '@/lib/fake-persona';

const DOC_TYPE_COLORS: Record<string, string> = {
  lab_report: 'bg-blue-500/20 text-blue-400',
  imaging: 'bg-purple-500/20 text-purple-400',
  discharge_summary: 'bg-orange-500/20 text-orange-400',
  rx_history: 'bg-green-500/20 text-green-400',
  clinical_note: 'bg-cyan-500/20 text-cyan-400',
  immunization_record: 'bg-yellow-500/20 text-yellow-400',
  genetic_report: 'bg-pink-500/20 text-pink-400',
  insurance: 'bg-gray-500/20 text-gray-400',
  other: 'bg-gray-500/20 text-gray-400',
};

const STATUS_STYLES: Record<string, string> = {
  complete: 'bg-emerald-500/20 text-emerald-400',
  partial: 'bg-yellow-500/20 text-yellow-400',
  error: 'bg-red-500/20 text-red-400',
};

function formatDocType(type: string) {
  return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function RecordsClient({ records }: { records: MedicalRecord[] }) {
  const { isPrivate } = usePrivacy();
  const data = isPrivate ? fakeRecords : records;

  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const types = Array.from(new Set(data.map(r => r.documentType))).sort();
  const statuses = Array.from(new Set(data.map(r => r.status))).sort();

  const getSafeDate = (dateStr: string | undefined): number => {
    if (!dateStr) return 0;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  };

  const filtered = data
    .filter(r =>
      (typeFilter === 'all' || r.documentType === typeFilter) &&
      (statusFilter === 'all' || r.status === statusFilter)
    )
    .sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return getSafeDate(b.uploadedAt) - getSafeDate(a.uploadedAt);
        case 'oldest':
          return getSafeDate(a.uploadedAt) - getSafeDate(b.uploadedAt);
        case 'date-range-newest':
          return getSafeDate(b.dateRange?.end) - getSafeDate(a.dateRange?.end);
        case 'date-range-oldest':
          return getSafeDate(a.dateRange?.start) - getSafeDate(b.dateRange?.start);
        case 'filename-asc':
          return a.filename.localeCompare(b.filename);
        case 'filename-desc':
          return b.filename.localeCompare(a.filename);
        default:
          return getSafeDate(b.uploadedAt) - getSafeDate(a.uploadedAt);
      }
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="text-xs bg-card border border-border rounded-lg px-3 py-1.5 text-foreground"
        >
          <option value="all">All Types</option>
          {types.map(t => (
            <option key={t} value={t}>{formatDocType(t)}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="text-xs bg-card border border-border rounded-lg px-3 py-1.5 text-foreground"
        >
          <option value="all">All Statuses</option>
          {statuses.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <select
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
          className="text-xs bg-card border border-border rounded-lg px-3 py-1.5 text-foreground"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="date-range-newest">Date range (newest)</option>
          <option value="date-range-oldest">Date range (oldest)</option>
          <option value="filename-asc">Filename A-Z</option>
          <option value="filename-desc">Filename Z-A</option>
        </select>
        {(typeFilter !== 'all' || statusFilter !== 'all' || sortOption !== 'newest') && (
          <button
            onClick={() => { setTypeFilter('all'); setStatusFilter('all'); setSortOption('newest'); }}
            className="text-xs text-muted hover:text-foreground transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="space-y-3">
        {filtered.map(record => (
          <div
            key={record.id}
            className="rounded-xl border border-border bg-card p-4 hover:bg-card-hover transition-colors duration-150 animate-in"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold truncate transition-all duration-200">
                    {record.filename}
                  </p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${DOC_TYPE_COLORS[record.documentType] ?? DOC_TYPE_COLORS.other}`}>
                    {formatDocType(record.documentType)}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[record.status] ?? STATUS_STYLES.error}`}>
                    {record.status}
                  </span>
                  {record.source && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-700 text-slate-200">
                      {record.source}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted mt-1">{record.description}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted transition-all duration-200">
                  {record.dateRange && (
                    <span>
                      {formatDate(record.dateRange.start)} – {formatDate(record.dateRange.end)}
                    </span>
                  )}
                  {record.recordCount != null && (
                    <span>{record.recordCount} record{record.recordCount !== 1 ? 's' : ''}</span>
                  )}
                  <span>Uploaded {formatDate(record.uploadedAt)}</span>
                </div>
                {record.errors && record.errors.length > 0 && (
                  <div className="mt-2">
                    <button
                      onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                      className="text-[11px] text-red-400 hover:text-red-300 transition-colors"
                    >
                      {expandedId === record.id ? '▾' : '▸'} {record.errors.length} error{record.errors.length !== 1 ? 's' : ''}
                    </button>
                    {expandedId === record.id && (
                      <ul className="mt-1 space-y-0.5 pl-3">
                        {record.errors.map((err, i) => (
                          <li key={i} className="text-[11px] text-red-400/80">• {err}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center">
            <p className="text-muted text-sm">No records match filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
