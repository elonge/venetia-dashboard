import { WithContext, Dataset } from 'schema-dts'; 
import React, { Suspense } from 'react';
import { Metadata } from 'next';
import DataRoomClient from './DataRoomClient';

export const metadata: Metadata = {
  title: 'Search 500+ Asquith-Venetia Letters',
  description: 'Access the complete structured dataset of the Asquith-Venetia correspondence (1912–1915). Filter by sentiment, date, topic, and entity analysis.',
};

export default function DataRoomPage() {
const jsonLd: WithContext<Dataset> = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'The Venetia Stanley Correspondence Dataset',
    description: 'A structured archive of 500+ letters between H.H. Asquith and Venetia Stanley (1912-1915), including sentiment analysis and geo-temporal metadata.',
    url: 'https://www.thevenetiaproject.com/data-room',
    creator: {
      '@type': 'Organization',
      name: 'The Venetia Project',
    },
    isAccessibleForFree: true,
    temporalCoverage: '1912-01-01/1915-05-31', // The exact date range of your history
  };  
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-page-bg flex items-center justify-center">
          <div className="text-navy">Loading...</div>
        </div>
      }
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DataRoomClient />
    </Suspense>
  );
}
