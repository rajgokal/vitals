'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface PrivacyContextValue {
  isPrivate: boolean;
  togglePrivacy: () => void;
}

const PrivacyContext = createContext<PrivacyContextValue>({
  isPrivate: false,
  togglePrivacy: () => {},
});

export function PrivacyProvider({ children }: { children: ReactNode }) {
  const [isPrivate, setIsPrivate] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('vitals:privacy');
    if (stored === 'true') setIsPrivate(true);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('vitals:privacy', String(isPrivate));
    }
  }, [isPrivate, mounted]);

  const togglePrivacy = () => setIsPrivate(prev => !prev);

  return (
    <PrivacyContext.Provider value={{ isPrivate: mounted ? isPrivate : false, togglePrivacy }}>
      {children}
    </PrivacyContext.Provider>
  );
}

export function usePrivacy() {
  return useContext(PrivacyContext);
}
