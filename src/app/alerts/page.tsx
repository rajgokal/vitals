'use client';

import Nav from '@/components/Nav';
import AlertBanner from '@/components/AlertBanner';
import AlertPanel from '@/components/AlertPanel';
import PrivacyToggle from '@/components/PrivacyToggle';
import PageHeader from '@/components/PageHeader';



export default function AlertsPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <div className="flex-1 flex flex-col">
        <AlertBanner />
        <main className="flex-1 pb-20 md:pb-0">
          <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-6">
            <header className="flex items-center justify-between">
              <div>
                <PageHeader title="Health Alerts">
                  <PrivacyToggle />
                </PageHeader>
                <p className="text-sm text-muted mt-1">
                  Monitor health alerts, flags, and action items
                </p>
              </div>
            </header>
            
            <AlertPanel />
          </div>
        </main>
      </div>
    </div>
  );
}
