'use client';

import { Eye, EyeOff, Shield } from 'lucide-react';
import { usePrivacy } from '@/context/PrivacyContext';
import { cn } from '@/lib/utils';

export default function PrivacyToggle() {
  const { isPrivate, togglePrivacy } = usePrivacy();

  return (
    <button
      onClick={togglePrivacy}
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200',
        'border cursor-pointer',
        isPrivate
          ? 'border-accent/30 bg-accent/10 text-accent hover:bg-accent/20'
          : 'border-border bg-card text-muted hover:text-foreground hover:bg-card-hover'
      )}
      title={isPrivate ? 'Privacy mode on — click to show details' : 'Click to enable privacy mode'}
    >
      <div className="relative w-4 h-4">
        <Eye
          className={cn(
            'w-4 h-4 absolute inset-0 transition-all duration-200',
            isPrivate ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
          )}
        />
        <EyeOff
          className={cn(
            'w-4 h-4 absolute inset-0 transition-all duration-200',
            isPrivate ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          )}
        />
      </div>
      {isPrivate && (
        <Shield className="w-3 h-3 text-accent" />
      )}
    </button>
  );
}
