import type { Interaction } from '@/lib/types';
import DashboardCard from './DashboardCard';
import { severityColor } from '@/lib/utils';

interface InteractionsTableProps {
  interactions: Interaction[] | null;
}

export default function InteractionsTable({ interactions }: InteractionsTableProps) {
  if (!interactions || interactions.length === 0) {
    return (
      <DashboardCard title="Interactions Watchlist">
        <p className="text-muted text-sm">No known interactions</p>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Interactions Watchlist">
      <div className="space-y-3">
        {interactions.map((ix, i) => (
          <div key={i} className="p-3 rounded-lg border border-border hover:bg-card-hover">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm font-medium">{ix.drugA || ix.drug1} ↔ {ix.drugB || ix.drug2}</p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${severityColor(ix.severity)}`}>
                {ix.severity}
              </span>
            </div>
            {(ix.description || ix.action) && (
              <p className="text-xs text-muted">{ix.action || ix.description}</p>
            )}
            {ix.recommendation && (
              <p className="text-xs text-accent mt-1">{ix.recommendation}</p>
            )}
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
