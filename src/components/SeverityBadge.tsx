'use client';

interface SeverityBadgeProps {
  severity: number;
}

function severityLevel(s: number): { label: string; classes: string } {
  if (s >= 8) return { label: 'Severe', classes: 'text-critical bg-critical/10 border-critical/20' };
  if (s >= 6) return { label: 'Moderate', classes: 'text-warning bg-warning/10 border-warning/20' };
  if (s >= 4) return { label: 'Mild', classes: 'text-info bg-info/10 border-info/20' };
  return { label: 'Low', classes: 'text-muted bg-muted/10 border-muted/20' };
}

export default function SeverityBadge({ severity }: SeverityBadgeProps) {
  const { label, classes } = severityLevel(severity);

  return (
    <div className="flex items-center gap-2">
      <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border ${classes}`}>
        {label}
      </span>
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              i < severity
                ? severity >= 8
                  ? 'bg-critical'
                  : severity >= 6
                    ? 'bg-warning'
                    : severity >= 4
                      ? 'bg-info'
                      : 'bg-muted'
                : 'bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
