'use client';

import React, { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import DataRoomPreview from './DataRoomPreview';

export default function DataRoom({
  previewVariant,
}: {
  previewVariant?: 'default' | 'compact';
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleOpenFull = useCallback(() => {
    router.push(`/data-room`);
  }, [pathname, router]);

  return (
    <>
      <DataRoomPreview onOpenFull={handleOpenFull} variant={previewVariant} />
    </>
  );
}
