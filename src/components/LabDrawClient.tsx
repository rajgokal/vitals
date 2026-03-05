'use client';

import MarkerRow from '@/components/MarkerRow';
import PrivacyToggle from '@/components/PrivacyToggle';
import { formatDate, relativeDate } from '@/lib/utils';
import { usePrivacy } from '@/context/PrivacyContext';
import type { LabDraw } from '@/lib/types';
import Link from 'next/link';

interface LabDrawClientProps {
  draw: LabDraw;
}

export default function LabDrawClient({ draw }: LabDrawClientProps) {
  const { isPrivate } = usePrivacy();

  // Group markers by category
  const categories = new Map<string, typeof draw.markers>();
  for (const m of draw.markers) {
    const cat = m.category || 'General';
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(m);
  }

  const displayDate = isPrivate ? relativeDate(draw.date) : formatDate(draw.date);
  const showOrderedBy = !isPrivate && draw.orderedBy && !draw.source.toLowerCase().includes(draw.orderedBy.toLowerCase());

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/labs" className="text-muted hover:text-foreground text-sm">← Labs</Link>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight transition-all duration-200">{displayDate}</h1>
          <p className="text-sm text-muted transition-all duration-200">
            {showOrderedBy ? `${draw.orderedBy} · ` : ''}{draw.source} · {draw.markers.length} markers
          </p>
        </div>
        <PrivacyToggle />
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
  );
}
