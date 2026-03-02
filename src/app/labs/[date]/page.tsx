import Nav from '@/components/Nav';
import MarkerRow from '@/components/MarkerRow';
import { kvGet } from '@/lib/kv';
import type { LabDraw } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ date: string }>;
}

export default async function LabDrawPage({ params }: Props) {
  const { date } = await params;
  const labs = await kvGet<LabDraw[]>('vitals:labs') ?? [];
  const draw = labs.find(d => d.date === date);

  if (!draw) notFound();

  // Group markers by category
  const categories = new Map<string, typeof draw.markers>();
  for (const m of draw.markers) {
    const cat = m.category || 'General';
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(m);
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-6">
          <div className="flex items-center gap-3">
            <Link href="/labs" className="text-muted hover:text-foreground text-sm">← Labs</Link>
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{formatDate(draw.date)}</h1>
            <p className="text-sm text-muted">
              {draw.orderedBy && !draw.source.toLowerCase().includes(draw.orderedBy.toLowerCase())
                ? `${draw.orderedBy} · ` : ''}{draw.source} · {draw.markers.length} markers
            </p>
          </div>
          {Array.from(categories.entries()).map(([cat, markers]) => (
            <div key={cat} className="rounded-xl border border-border bg-card p-4 animate-in">
              <h2 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">{cat}</h2>
              <div className="space-y-0.5">
                {markers.map(m => <MarkerRow key={m.name} marker={m} />)}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
