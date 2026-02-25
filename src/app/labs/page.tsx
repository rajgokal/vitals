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
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight">Lab Draws</h1>
            {sorted.length > 0 && (
              <span className="text-xs text-muted">{sorted.length} draw{sorted.length !== 1 ? 's' : ''}</span>
            )}
          </div>
          {sorted.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
              <p className="text-muted text-sm">No lab data yet</p>
              <p className="text-xs text-muted mt-1">Lab draws will appear here once uploaded</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.map((draw, i) => {
                const flagged = draw.markers.filter(m => m.flag);
                return (
                  <Link
                    key={draw.date}
                    href={`/labs/${draw.date}`}
                    className="block rounded-xl border border-border bg-card p-4 hover:bg-card-hover hover:border-border/80 transition-all duration-150 animate-in"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{formatDate(draw.date)}</p>
                        <p className="text-xs text-muted mt-0.5">{draw.source} · {draw.markers.length} markers</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {flagged.length > 0 && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full text-warning bg-warning/10 border border-warning/20">
                            {flagged.length} flagged
                          </span>
                        )}
                        <span className="text-xs text-muted">→</span>
                      </div>
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
