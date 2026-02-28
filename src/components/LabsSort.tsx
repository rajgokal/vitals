'use client';

import { ChevronDown } from 'lucide-react';

export type SortMode = 'frequency' | 'date' | 'name' | 'flagged';
export type FilterMode = 'all' | 'flagged' | 'normal';

interface LabsSortProps {
  sort: SortMode;
  filter: FilterMode;
  onSortChange: (s: SortMode) => void;
  onFilterChange: (f: FilterMode) => void;
}

const sortOptions: { value: SortMode; label: string }[] = [
  { value: 'frequency', label: '# Readings' },
  { value: 'date', label: 'Date' },
  { value: 'name', label: 'Name' },
  { value: 'flagged', label: 'Problem areas' },
];

const filterOptions: { value: FilterMode; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'flagged', label: 'Flagged' },
  { value: 'normal', label: 'Normal' },
];

export default function LabsSort({ sort, filter, onSortChange, onFilterChange }: LabsSortProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Sort */}
      <div className="relative">
        <select
          value={sort}
          onChange={e => onSortChange(e.target.value as SortMode)}
          className="appearance-none bg-card border border-border rounded-lg text-xs px-3 py-1.5 pr-7 text-foreground cursor-pointer hover:bg-card-hover transition-colors focus:outline-none focus:ring-1 focus:ring-accent/50"
        >
          {sortOptions.map(o => (
            <option key={o.value} value={o.value}>Sort: {o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted pointer-events-none" />
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5">
        {filterOptions.map(o => (
          <button
            key={o.value}
            type="button"
            onClick={() => onFilterChange(o.value)}
            className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
              filter === o.value
                ? 'bg-accent/15 text-accent border-accent/30'
                : 'bg-card text-muted border-border hover:text-foreground'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
