'use client';

import React from 'react';
import DataRoomPreview from './DataRoomPreview';

export default function DataRoom({
  previewVariant,
}: {
  previewVariant?: 'default' | 'compact';
}) {
  return (
    <>
      <DataRoomPreview  variant={previewVariant} />
    </>
  );
}
