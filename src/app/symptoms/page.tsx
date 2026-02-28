'use client';

import { useState, useMemo } from 'react';
import Nav from '@/components/Nav';
import TimelineEntry from '@/components/TimelineEntry';
import { symptomsTimeline } from '@/lib/symptoms-data';

const allTags = Array.from(
  new Set(symptomsTimeline.flatMap(e => e.tags))
).sort();

export default function SymptomsPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(
    () => activeTag
      ? symptomsTimeline.filter(e => e.tags.includes(activeTag))
      : symptomsTimeline,
    [activeTag]
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-3xl mx-auto px-4 py-6 md:py-10 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Symptoms Timeline</h1>
            <p className="text-xs text-muted mt-1">
              {filtered.length} entries · Tap to expand details
            </p>
          </div>

          {/* Tag filter chips */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                activeTag === null
                  ? 'bg-accent/15 text-accent border-accent/30'
                  : 'bg-card text-muted border-border hover:text-foreground'
              }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(prev => prev === tag ? null : tag)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                  activeTag === tag
                    ? 'bg-accent/15 text-accent border-accent/30'
                    : 'bg-card text-muted border-border hover:text-foreground'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Timeline */}
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
              <p className="text-muted text-sm">No entries match this filter</p>
            </div>
          ) : (
            <div className="pt-2">
              {filtered.map((entry, i) => (
                <TimelineEntry
                  key={entry.id}
                  entry={entry}
                  index={i}
                  isLast={i === filtered.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
