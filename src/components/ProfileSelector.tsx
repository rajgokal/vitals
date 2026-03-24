'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, User, Users, Baby } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Profile } from '@/lib/types';

interface ProfileSelectorProps {
  profiles: Profile[];
  currentProfileId: string;
}

function getProfileIcon(relationship?: string) {
  switch (relationship) {
    case 'self':
      return User;
    case 'spouse':
      return Users;
    case 'daughter':
    case 'son':
      return Baby;
    case 'demo':
      return User;
    default:
      return User;
  }
}

export default function ProfileSelector({ profiles, currentProfileId }: ProfileSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  // Fix hydration mismatch by only running client-side code after mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const currentProfile = profiles.find(p => p.id === currentProfileId);
  
  const handleProfileChange = (profileId: string) => {
    if (!mounted) return;
    
    // Get current search params from window.location instead of useSearchParams hook
    const currentParams = new URLSearchParams(window.location.search);
    
    if (profileId === 'raj') {
      // Remove profileId param for default profile
      currentParams.delete('profileId');
    } else {
      currentParams.set('profileId', profileId);
    }
    
    const newUrl = currentParams.toString() ? `/?${currentParams.toString()}` : '/';
    router.push(newUrl);
    setIsOpen(false);
  };

  // Don't render the interactive elements until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex gap-2 md:hidden">
        <div className="w-16 h-7 bg-card rounded-full animate-pulse" />
        <div className="w-16 h-7 bg-card rounded-full animate-pulse" />
      </div>
    );
  }

  // For mobile: pill design
  const MobilePillSelector = () => (
    <div className="flex gap-2 overflow-x-auto pb-1 md:hidden">
      {profiles.map((profile) => {
        const Icon = getProfileIcon(profile.relationship);
        const isActive = profile.id === currentProfileId;
        
        return (
          <button
            key={profile.id}
            onClick={() => handleProfileChange(profile.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap',
              isActive
                ? 'text-white shadow-sm'
                : 'text-muted hover:text-foreground hover:bg-card-hover border border-border'
            )}
            style={isActive ? { 
              backgroundColor: profile.color || '#4F46E5',
              borderColor: profile.color || '#4F46E5'
            } : {}}
          >
            <Icon className="w-3 h-3" />
            <span>{profile.name.split(' ')[0]}</span>
          </button>
        );
      })}
    </div>
  );

  // For desktop: dropdown design
  const DesktopDropdownSelector = () => (
    <div className="relative hidden md:block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200',
          'border border-border bg-card hover:bg-card-hover'
        )}
      >
        {currentProfile && (
          <>
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: currentProfile.color || '#4F46E5' }}
            />
            <span className="font-medium">{currentProfile.name}</span>
            <span className="text-xs text-muted">
              ({currentProfile.relationship === 'self' ? 'Me' : currentProfile.relationship})
            </span>
          </>
        )}
        <ChevronDown className={cn(
          'w-4 h-4 text-muted transition-transform duration-200',
          isOpen && 'rotate-180'
        )} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-56 py-1 bg-card border border-border rounded-lg shadow-lg z-50 animate-in">
          {profiles.map((profile) => {
            const Icon = getProfileIcon(profile.relationship);
            const isActive = profile.id === currentProfileId;
            
            return (
              <button
                key={profile.id}
                onClick={() => handleProfileChange(profile.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-card-hover transition-colors',
                  isActive && 'bg-accent-dim text-accent'
                )}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: profile.color || '#4F46E5' }}
                  />
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{profile.name}</div>
                  <div className="text-xs text-muted">
                    {profile.relationship === 'self' ? 'Me' : 
                     profile.relationship === 'demo' ? 'Demo Profile' :
                     profile.relationship}
                  </div>
                </div>
                {profile.age > 0 && (
                  <div className="text-xs text-muted">
                    Age {profile.age}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <>
      <MobilePillSelector />
      <DesktopDropdownSelector />
      {/* Backdrop for dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}