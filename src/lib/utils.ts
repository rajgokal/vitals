export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function daysAgo(dateStr: string): number {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

export function severityColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'text-critical bg-critical/10 border-critical/20';
    case 'high': return 'text-critical bg-critical/10 border-critical/20';
    case 'moderate':
    case 'medium': return 'text-warning bg-warning/10 border-warning/20';
    case 'low': return 'text-info bg-info/10 border-info/20';
    default: return 'text-muted bg-muted/10 border-muted/20';
  }
}

export function relativeDate(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'upcoming';
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  const weeks = Math.floor(diffDays / 7);
  if (diffDays < 30) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  const months = Math.floor(diffDays / 30);
  if (diffDays < 365) return `${months} month${months > 1 ? 's' : ''} ago`;
  const years = Math.floor(diffDays / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

export function flagColor(flag?: 'high' | 'low' | 'critical'): string {
  switch (flag) {
    case 'critical': return 'text-critical';
    case 'high': return 'text-warning';
    case 'low': return 'text-info';
    default: return 'text-foreground';
  }
}
