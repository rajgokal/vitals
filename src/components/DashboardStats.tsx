'use client';

import { usePrivacy } from '@/context/PrivacyContext';
import { fakeLabs, fakeMedications } from '@/lib/fake-persona';

interface DashboardStatsProps {
  labCount: number;
  activeMeds: number;
  lastDrawDate?: string;
}

export default function DashboardStats({ labCount, activeMeds, lastDrawDate }: DashboardStatsProps) {
  const { isPrivate } = usePrivacy();

  const displayLabCount = isPrivate ? fakeLabs.length : labCount;
  const displayActiveMeds = isPrivate
    ? fakeMedications.filter(m => m.status === 'current' || m.active).length
    : activeMeds;
  const displayLastDraw = isPrivate ? fakeLabs[0]?.date : lastDrawDate;

  return (
    <div className="flex gap-4 text-xs text-muted transition-all duration-200">
      <span>{displayLabCount} lab draws</span>
      <span>{displayActiveMeds} active meds</span>
      {displayLastDraw && <span>Last draw {displayLastDraw}</span>}
    </div>
  );
}
