'use client';

import GeneticsPanel from './GeneticsPanel';
import InteractionsTable from './InteractionsTable';
import PrivacyToggle from './PrivacyToggle';
import { usePrivacy } from '@/context/PrivacyContext';
import { fakeGenetics, fakeInteractions } from '@/lib/fake-persona';
import type { GeneticsPanel as GeneticsPanelType, Interaction } from '@/lib/types';

interface GeneticsClientProps {
  genetics: GeneticsPanelType | null;
  interactions: Interaction[] | null;
}

export default function GeneticsClient({ genetics, interactions }: GeneticsClientProps) {
  const { isPrivate } = usePrivacy();
  const displayGenetics = isPrivate ? fakeGenetics : genetics;
  const displayInteractions = isPrivate ? fakeInteractions : interactions;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold tracking-tight">Genetics & Interactions</h1>
        <PrivacyToggle />
      </div>
      <GeneticsPanel genetics={displayGenetics} />
      <InteractionsTable interactions={displayInteractions} />
    </div>
  );
}
