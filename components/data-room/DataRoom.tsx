'use client';

import React, { useState } from 'react';
import DataRoomPreview from './DataRoomPreview';
import DataRoomFull from './DataRoomFull';
import { ZoomKey, ZoomState, zoomDefaults } from './dataRoomTypes';

export default function DataRoom() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeChartIndex, setActiveChartIndex] = useState(0);
  const [zoomStates, setZoomStates] = useState<Record<ZoomKey, ZoomState>>(zoomDefaults);

  const handleOpenFull = () => {
    setIsModalOpen(true);
  };

  const handleCloseFull = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <DataRoomPreview 
        onOpenFull={handleOpenFull}
        activeChartIndex={activeChartIndex}
        onChartIndexChange={setActiveChartIndex}
        zoomStates={zoomStates}
        onZoomStatesChange={setZoomStates}
      />
      {isModalOpen && (
        <DataRoomFull
          onClose={handleCloseFull}
          initialChartIndex={2}
          initialZoomStates={zoomStates}
          onChartIndexChange={setActiveChartIndex}
          onZoomStatesChange={setZoomStates}
        />
      )}
    </>
  );
}
