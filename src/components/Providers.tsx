'use client';

import { PrivacyProvider } from '@/context/PrivacyContext';
import type { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return <PrivacyProvider>{children}</PrivacyProvider>;
}
