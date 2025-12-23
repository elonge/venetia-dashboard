'use client';

import React from 'react';
import VenetiaSimulationLab from '@/components/SimulationLab';
import { useChatVisibility } from '@/components/chat/useChatVisibility';

export default function LabPage() {
  useChatVisibility(false);

  return <VenetiaSimulationLab />;
}

