'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/wearables', label: 'Overview' },
  { href: '/wearables/sleep', label: 'Sleep' },
  { href: '/wearables/activity', label: 'Activity' },
];

export default function WearableNav() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 border-b border-border mb-6">
      {tabs.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'px-4 py-2.5 text-sm transition-all border-b-2 -mb-px',
              active
                ? 'text-accent border-accent font-medium'
                : 'text-muted border-transparent hover:text-foreground'
            )}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
