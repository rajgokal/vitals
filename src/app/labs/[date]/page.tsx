import Nav from '@/components/Nav';
import LabDrawClient from '@/components/LabDrawClient';
import { kvGet } from '@/lib/kv';
import type { LabDraw } from '@/lib/types';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ date: string }>;
}

export default async function LabDrawPage({ params }: Props) {
  const { date } = await params;
  const labs = await kvGet<LabDraw[]>('vitals:labs') ?? [];
  const draw = labs.find(d => d.date === date);

  if (!draw) notFound();

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Nav />
      <main className="flex-1 pb-20 md:pb-0">
        <LabDrawClient draw={draw} />
      </main>
    </div>
  );
}
