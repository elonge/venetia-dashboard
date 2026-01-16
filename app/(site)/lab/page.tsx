'use client';

import { useChatVisibility } from '@/components/chat/useChatVisibility';
import VenetiaSimulationLabNew from '@/components/SimulationLabNew';

export default function LabPage() {
  useChatVisibility(false);

  return <VenetiaSimulationLabNew />;
}

