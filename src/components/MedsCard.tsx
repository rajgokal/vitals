import type { Medication } from '@/lib/types';
import DashboardCard from './DashboardCard';
import Link from 'next/link';

interface MedsCardProps {
  medications: Medication[] | null;
}

export default function MedsCard({ medications }: MedsCardProps) {
  const active = medications?.filter(m => m.active) ?? [];

  return (
    <DashboardCard
      title="Medications"
      action={<Link href="/medications" className="text-xs text-accent hover:underline">View all</Link>}
    >
      {active.length === 0 ? (
        <p className="text-muted text-sm">No active medications</p>
      ) : (
        <ul className="space-y-2.5">
          {active.slice(0, 5).map(m => (
            <li key={m.name} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{m.name}</p>
                <p className="text-xs text-muted">{m.dosage} · {m.frequency}</p>
              </div>
            </li>
          ))}
          {active.length > 5 && (
            <li className="text-xs text-muted">+{active.length - 5} more</li>
          )}
        </ul>
      )}
    </DashboardCard>
  );
}
