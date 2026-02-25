import type { GeneticsPanel as GeneticsPanelType } from '@/lib/types';
import DashboardCard from './DashboardCard';

interface GeneticsPanelProps {
  genetics: GeneticsPanelType | null;
}

export default function GeneticsPanel({ genetics }: GeneticsPanelProps) {
  if (!genetics) {
    return (
      <DashboardCard title="Pharmacogenomics">
        <p className="text-muted text-sm">No genetics data yet</p>
      </DashboardCard>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardCard title="CYP Enzymes">
        <div className="space-y-2">
          {genetics.enzymes.map(e => (
            <div key={e.gene} className="flex items-start justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-mono font-medium">{e.gene}</p>
                <p className="text-xs text-muted">{e.variant}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-info">{e.metabolizerStatus}</p>
                <p className="text-xs text-muted max-w-48">{e.implications}</p>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

      {genetics.hlaTypes.length > 0 && (
        <DashboardCard title="HLA Types">
          <div className="space-y-2">
            {genetics.hlaTypes.map(h => (
              <div key={h.gene} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm font-mono">{h.gene} — {h.variant}</span>
                <span className="text-xs text-warning">{h.risk}</span>
              </div>
            ))}
          </div>
        </DashboardCard>
      )}

      {genetics.actionableFlags.length > 0 && (
        <DashboardCard title="Actionable Flags">
          <div className="flex flex-wrap gap-2">
            {genetics.actionableFlags.map(f => (
              <span key={f} className="px-3 py-1 text-xs rounded-full bg-warning/10 text-warning border border-warning/20">
                {f}
              </span>
            ))}
          </div>
        </DashboardCard>
      )}
    </div>
  );
}
