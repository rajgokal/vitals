import Nav from '@/components/Nav';
import { kvGet } from '@/lib/kv';
import type { Medication } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function MedicationsPage() {
  const medications = await kvGet<Medication[]>('vitals:medications') ?? [];
  const active = medications.filter(m => m.status === 'current' || m.active);
  const historical = medications.filter(m => m.status === 'stopped' || (m.active === false));

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-8">
          <h1 className="text-xl font-semibold tracking-tight">Medications</h1>

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
                {active.map(m => (
                  <div key={m.name} className="rounded-xl border border-border bg-card p-4 hover:bg-card-hover transition-colors duration-150 animate-in">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold">{m.name}</p>
                        <p className="text-xs text-muted mt-0.5">{m.dose || m.dosage} · {m.frequency}</p>
                        {m.prescriber && <p className="text-xs text-muted">Rx: {m.prescriber}</p>}
                        {m.notes && <p className="text-xs text-muted mt-1 italic">{m.notes}</p>}
                      </div>
                      <span className="text-xs text-muted whitespace-nowrap ml-4">{m.startDate ? `Since ${formatDate(m.startDate)}` : ''}</span>
                    </div>
                  </div>
                ))}
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
                {historical.map(m => (
                  <div key={m.name + m.startDate} className="rounded-xl border border-border/60 bg-card/50 p-3.5 opacity-70 hover:opacity-90 transition-opacity duration-150">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">{m.name} — {m.dose || m.dosage}</p>
                        {m.notes && <p className="text-xs text-muted mt-0.5 italic">{m.notes}</p>}
                      </div>
                      <span className="text-xs text-muted whitespace-nowrap ml-4">
                        {m.startDate ? formatDate(m.startDate) : '?'} – {m.endDate ? formatDate(m.endDate) : '?'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
