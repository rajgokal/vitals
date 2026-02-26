import type { Supplement } from '@/lib/types';
import DashboardCard from './DashboardCard';

interface SupplementsCardProps {
  supplements: Supplement[] | null;
}

export default function SupplementsCard({ supplements }: SupplementsCardProps) {
  const active = supplements?.filter(s => s.status === 'current' || s.active) ?? [];

  return (
    <DashboardCard title="Supplements">
      {active.length === 0 ? (
        <p className="text-muted text-sm">No active supplements</p>
      ) : (
        <ul className="space-y-2">
          {active.map(s => (
            <li key={s.name} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted">{s.dose || s.dosage} · {s.timing || s.frequency}</p>
              </div>
              {s.reason && <span className="text-xs text-muted">{s.reason}</span>}
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
