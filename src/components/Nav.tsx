'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FlaskConical,
  Pill,
  Dna,
  Users,
  Activity,
  FolderOpen,
  HeartPulse,
  Shield,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
  Icon: LucideIcon;
}

const links: NavLink[] = [
  { href: '/', label: 'Overview', Icon: LayoutDashboard },
  { href: '/labs', label: 'Labs', Icon: FlaskConical },
  { href: '/medications', label: 'Meds', Icon: Pill },
  { href: '/symptoms', label: 'Symptoms', Icon: HeartPulse },
  { href: '/genetics', label: 'Genetics', Icon: Dna },
  { href: '/providers', label: 'Team', Icon: Users },
  { href: '/wearables', label: 'Wearables', Icon: Activity },
  { href: '/records', label: 'Records', Icon: FolderOpen },
  { href: '/alerts', label: 'Alerts', Icon: Shield },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] md:static md:border-t-0 md:border-r md:w-56 md:min-h-screen md:pb-0">
      <div className="flex justify-around py-2 px-2 md:flex-col md:justify-start md:gap-1 md:py-6 md:px-3">
        <div className="hidden md:block mb-6 px-3">
          <Image
            src="/vitals-logo.png"
            alt="Vitals"
            width={100}
            height={32}
            className="h-7 w-auto brightness-0 invert"
            priority
          />
          <p className="text-xs text-muted mt-1">Health Dashboard</p>
        </div>
        {links.map(({ href, label, Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-xs transition-all duration-150',
                'md:flex-row md:gap-3 md:text-sm md:px-3 md:py-2.5',
                active
                  ? 'text-accent bg-accent-dim font-medium'
                  : 'text-muted hover:text-foreground hover:bg-card-hover'
              )}
            >
              <Icon className="w-[18px] h-[18px] md:w-4 md:h-4 shrink-0" strokeWidth={active ? 2.2 : 1.8} />
              <span className="text-[10px] md:text-sm">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
