import type { LabMarker } from '@/lib/types';
import { flagColor } from '@/lib/utils';

interface MarkerRowProps {
  marker: LabMarker;
}

export default function MarkerRow({ marker }: MarkerRowProps) {
  const rangeText = marker.referenceRange.text
    ?? (marker.referenceRange.low != null && marker.referenceRange.high != null
      ? `${marker.referenceRange.low}–${marker.referenceRange.high}`
      : '');

  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-card-hover">
      <div className="flex-1 min-w-0">
        <span className="text-sm">{marker.name}</span>
        {marker.category && (
          <span className="text-xs text-muted ml-2">{marker.category}</span>
        )}
      </div>
      <div className="flex items-center gap-3 text-right">
        <span className={`text-sm font-mono font-medium ${flagColor(marker.flag)}`}>
          {marker.value} <span className="text-xs text-muted">{marker.unit}</span>
        </span>
        {rangeText && (
          <span className="text-xs text-muted w-24 text-right hidden sm:block">{rangeText}</span>
        )}
        {marker.flag && (
          <span className={`text-xs font-medium uppercase ${flagColor(marker.flag)}`}>
            {marker.flag}
          </span>
        )}
      </div>
    </div>
  );
}
