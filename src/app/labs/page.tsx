import Nav from '@/components/Nav';
import { kvGet } from '@/lib/kv';
import type { LabDraw } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function LabsPage() {
  const labs = await kvGet<LabDraw[]>('vitals:labs') ?? [];
  const sorted = labs.sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-6">
          <h1 className="text-xl font-semibold tracking-tight">Lab Draws</h1>
          {sorted.length === 0 ? (
            <p className="text-muted text-sm">No lab data yet</p>
          ) : (
            <div className="space-y-3">
              {sorted.map(draw => {
                const flagged = draw.markers.filter(m => m.flag);
                return (
                  <Link
                    key={draw.date}
                    href={`/labs/${draw.date}`}
                    className="block rounded-xl border border-border bg-card p-4 hover:bg-card-hover animate-in"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{formatDate(draw.date)}</p>
                        <p className="text-xs text-muted">{draw.source} · {draw.markers.length} markers</p>
                      </div>
                      {flagged.length > 0 && (
                        <span className="text-xs text-warning">{flagged.length} flagged</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
