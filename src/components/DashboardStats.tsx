'use client';

import { usePrivacy } from '@/context/PrivacyContext';
import { relativeDate } from '@/lib/utils';

interface DashboardStatsProps {
  labCount: number;
  activeMeds: number;
  lastDrawDate?: string;
}

export default function DashboardStats({ labCount, activeMeds, lastDrawDate }: DashboardStatsProps) {
  const { isPrivate } = usePrivacy();

  return (
    <div className="flex gap-4 text-xs text-muted transition-all duration-200">
      <span>{labCount} lab draws</span>
      <span>{activeMeds} active meds</span>
      {lastDrawDate && (
        <span>Last draw {isPrivate ? relativeDate(lastDrawDate) : lastDrawDate}</span>
      )}
    </div>
  );
}
