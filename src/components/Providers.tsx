'use client';

import { PrivacyProvider } from '@/context/PrivacyContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import type { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <PrivacyProvider>{children}</PrivacyProvider>
    </ErrorBoundary>
  );
}
