'use client';

import type { Medication } from '@/lib/types';
import { formatDate, relativeDate } from '@/lib/utils';
import { usePrivacy } from '@/context/PrivacyContext';
import { anonymizeDrugName } from '@/lib/anonymize';
import PrivacyToggle from './PrivacyToggle';

interface MedicationsClientProps {
  active: Medication[];
  historical: Medication[];
}

export default function MedicationsClient({ active, historical }: MedicationsClientProps) {
  const { isPrivate } = usePrivacy();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-8">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold tracking-tight">Medications</h1>
        <PrivacyToggle />
      </div>

      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <h2 className="text-sm font-medium text-muted uppercase tracking-wider">Active</h2>
          {active.length > 0 && (
            <span className="text-xs text-muted">({active.length})</span>
          )}
        </div>
        {active.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
            <p className="text-muted text-sm">No active medications</p>
            <p className="text-xs text-muted mt-1">Medications will appear here once added</p>
          </div>
        ) : (
          <div className="space-y-3">
            {active.map(m => {
              const displayName = isPrivate ? anonymizeDrugName(m.name) : m.name;
              const displayDose = isPrivate ? null : (m.dose || m.dosage);
              const displayPrescriber = isPrivate ? null : m.prescriber;
              const displayStart = m.startDate
                ? (isPrivate ? relativeDate(m.startDate) : formatDate(m.startDate))
                : null;
              return (
                <div key={m.name} className="rounded-xl border border-border bg-card p-4 hover:bg-card-hover transition-colors duration-150 animate-in">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold transition-all duration-200">{displayName}</p>
                      <p className="text-xs text-muted mt-0.5 transition-all duration-200">
                        {displayDose ? `${displayDose} · ` : ''}{m.frequency}
                      </p>
                      {displayPrescriber && <p className="text-xs text-muted">Rx: {displayPrescriber}</p>}
                      {!isPrivate && m.notes && <p className="text-xs text-muted mt-1 italic">{m.notes}</p>}
                    </div>
                    {displayStart && (
                      <span className="text-xs text-muted whitespace-nowrap ml-4">Since {displayStart}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {historical.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-muted" />
            <h2 className="text-sm font-medium text-muted uppercase tracking-wider">Historical</h2>
            <span className="text-xs text-muted">({historical.length})</span>
          </div>
          <div className="space-y-2">
            {historical.map(m => {
              const displayName = isPrivate ? anonymizeDrugName(m.name) : m.name;
              const displayDose = isPrivate ? '' : ` — ${m.dose || m.dosage}`;
              const displayStart = m.startDate
                ? (isPrivate ? relativeDate(m.startDate) : formatDate(m.startDate))
                : '?';
              const displayEnd = m.endDate
                ? (isPrivate ? relativeDate(m.endDate) : formatDate(m.endDate))
                : '?';
              return (
                <div key={m.name + m.startDate} className="rounded-xl border border-border/60 bg-card/50 p-3.5 opacity-70 hover:opacity-90 transition-opacity duration-150">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm transition-all duration-200">{displayName}{displayDose}</p>
                      {!isPrivate && m.notes && <p className="text-xs text-muted mt-0.5 italic">{m.notes}</p>}
                    </div>
                    <span className="text-xs text-muted whitespace-nowrap ml-4">
                      {displayStart} – {displayEnd}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
