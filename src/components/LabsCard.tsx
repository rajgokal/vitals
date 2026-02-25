import type { LabDraw } from '@/lib/types';
import DashboardCard from './DashboardCard';
import MarkerRow from './MarkerRow';
import Link from 'next/link';
import { formatDate, daysAgo } from '@/lib/utils';

interface LabsCardProps {
  labs: LabDraw[] | null;
}

export default function LabsCard({ labs }: LabsCardProps) {
  const latest = labs?.[0];

  return (
    <DashboardCard
      title="Latest Labs"
      className="md:col-span-2"
      action={<Link href="/labs" className="text-xs text-accent hover:underline">All draws</Link>}
    >
      {!latest ? (
        <p className="text-muted text-sm">No lab data yet</p>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-3">
            <p className="text-sm font-medium">{formatDate(latest.date)}</p>
            <span className="text-xs text-muted">{daysAgo(latest.date)}d ago · {latest.source}</span>
          </div>
          <div className="space-y-1">
            {latest.markers.slice(0, 8).map(m => (
              <MarkerRow key={m.name} marker={m} />
            ))}
            {latest.markers.length > 8 && (
              <Link href={`/labs/${latest.date}`} className="block text-xs text-accent hover:underline pt-1">
                +{latest.markers.length - 8} more markers
              </Link>
            )}
          </div>
        </>
      )}
    </DashboardCard>
  );
}
