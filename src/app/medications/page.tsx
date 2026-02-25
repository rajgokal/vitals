import Nav from '@/components/Nav';
import { kvGet } from '@/lib/kv';
import type { Medication } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function MedicationsPage() {
  const medications = await kvGet<Medication[]>('vitals:medications') ?? [];
  const active = medications.filter(m => m.active);
  const historical = medications.filter(m => !m.active);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-6">
          <h1 className="text-xl font-semibold tracking-tight">Medications</h1>

          <section>
            <h2 className="text-sm font-medium text-muted uppercase tracking-wider mb-3">Active</h2>
            {active.length === 0 ? (
              <p className="text-muted text-sm">No active medications</p>
            ) : (
              <div className="space-y-3">
                {active.map(m => (
                  <div key={m.name} className="rounded-xl border border-border bg-card p-4 animate-in">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold">{m.name}</p>
                        <p className="text-xs text-muted mt-0.5">{m.dosage} · {m.frequency}</p>
                        {m.prescriber && <p className="text-xs text-muted">Rx: {m.prescriber}</p>}
                        {m.notes && <p className="text-xs text-muted mt-1">{m.notes}</p>}
                      </div>
                      <span className="text-xs text-muted">Since {formatDate(m.startDate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {historical.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-muted uppercase tracking-wider mb-3">Historical</h2>
              <div className="space-y-2 opacity-60">
                {historical.map(m => (
                  <div key={m.name + m.startDate} className="rounded-xl border border-border bg-card p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">{m.name} — {m.dosage}</p>
                        {m.notes && <p className="text-xs text-muted">{m.notes}</p>}
                      </div>
                      <span className="text-xs text-muted">
                        {formatDate(m.startDate)} – {m.endDate ? formatDate(m.endDate) : '?'}
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
