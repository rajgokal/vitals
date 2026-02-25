import Nav from '@/components/Nav';
import WearableNav from '@/components/wearables/WearableNav';

export default function WearablesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
          <header className="mb-4">
            <h1 className="text-xl font-semibold tracking-tight">Wearables</h1>
            <p className="text-sm text-muted mt-0.5">Oura & Whoop data</p>
          </header>
          <WearableNav />
          {children}
        </div>
      </main>
    </div>
  );
}
