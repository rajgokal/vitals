import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export default function DashboardCard({ title, children, className, action }: DashboardCardProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-5 animate-in', className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-muted uppercase tracking-wider">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}
