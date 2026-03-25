import type { GeneticsPanel as GeneticsPanelType } from '@/lib/types';
import DashboardCard from './DashboardCard';
import { cn } from '@/lib/utils';

interface GeneticsPanelProps {
  genetics: GeneticsPanelType | null;
}

function metabolizerBadge(status: string): string {
  const s = status.toLowerCase();
  if (s.includes('poor')) return 'text-critical bg-critical/10 border border-critical/20';
  if (s.includes('ultra') || s.includes('rapid')) return 'text-warning bg-warning/10 border border-warning/20';
  if (s.includes('intermediate')) return 'text-info bg-info/10 border border-info/20';
  return 'text-accent bg-accent-dim border border-accent/20';
}

export default function GeneticsPanel({ genetics }: GeneticsPanelProps) {
  if (!genetics) {
    return (
      <DashboardCard title="Pharmacogenomics">
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
          <p className="text-muted text-sm">No genetics data yet</p>
          <p className="text-xs text-muted mt-1">Pharmacogenomic results will appear here</p>
        </div>
      </DashboardCard>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardCard title="CYP Enzymes">
        <div className="space-y-0">
          {Array.isArray(genetics.enzymes) ? genetics.enzymes.map(e => (
            <div key={e.gene} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-border last:border-0 gap-2">
              <div className="flex items-center gap-3">
                <p className="text-sm font-mono font-medium w-24 shrink-0">{e.gene}</p>
                <p className="text-xs text-muted">{e.genotype || e.variant}</p>
              </div>
              <div className="flex items-center gap-2 sm:text-right">
                <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', metabolizerBadge(e.phenotype || e.metabolizerStatus || ''))}>
                  {e.phenotype || e.metabolizerStatus}
                </span>
                <p className="text-xs text-muted max-w-48 hidden md:block">{e.impact || e.implications}</p>
              </div>
            </div>
          )) : []}
        </div>
      </DashboardCard>

      {Array.isArray(genetics.hlaTypes) && genetics.hlaTypes.length > 0 && (
        <DashboardCard title="HLA Types">
          <div className="space-y-0">
            {genetics.hlaTypes.map((h, i) => (
              <div key={h.gene || h.marker || i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <span className="text-sm font-mono">{h.gene || h.marker} — {h.variant || h.result}</span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full text-warning bg-warning/10 border border-warning/20">{h.risk}</span>
              </div>
            ))}
          </div>
        </DashboardCard>
      )}

      {(genetics.actionableFlags || genetics.flags || []).length > 0 && (
        <DashboardCard title="Actionable Flags">
          <div className="flex flex-wrap gap-2">
            {(genetics.actionableFlags || genetics.flags || []).map(f => (
              <span key={f} className="px-3 py-1.5 text-xs rounded-full bg-warning/10 text-warning border border-warning/20 font-medium">
                {f}
              </span>
            ))}
          </div>
        </DashboardCard>
      )}
    </div>
  );
}
