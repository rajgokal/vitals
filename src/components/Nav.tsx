'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Overview', icon: '◉' },
  { href: '/labs', label: 'Labs', icon: '◎' },
  { href: '/medications', label: 'Meds', icon: '◈' },
  { href: '/genetics', label: 'Genetics', icon: '◇' },
  { href: '/providers', label: 'Team', icon: '◆' },
  { href: '/wearables', label: 'Wearables', icon: '♥' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] md:static md:border-t-0 md:border-r md:w-56 md:min-h-screen md:pb-0">
      <div className="flex justify-around py-2 px-2 md:flex-col md:justify-start md:gap-1 md:py-6 md:px-3">
        <div className="hidden md:block mb-6 px-3">
          <span className="text-accent font-semibold text-lg tracking-tight">Vitals</span>
          <p className="text-xs text-muted mt-0.5">Health Dashboard</p>
        </div>
        {links.map(({ href, label, icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-150',
                'md:flex-row md:gap-3 md:text-sm md:px-3 md:py-2.5',
                active
                  ? 'text-accent bg-accent-dim font-medium'
                  : 'text-muted hover:text-foreground hover:bg-card-hover'
              )}
            >
              <span className="text-base md:text-sm">{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
