import { Metadata } from 'next';
import VenetiaBio from './VenetiaBio';

export const metadata: Metadata = {
  title: 'Who was Venetia Stanley?',
  description: 'The socialite who captivated a Prime Minister.',
  
  // Optional: Unique Social Image for this bio page
  openGraph: {
    title: 'Who was Venetia Stanley?',
    description: 'The socialite who captivated a Prime Minister.',
    images: ['/venetia-without-clementine.png'],
  },
};

export default function VenetiaPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: 'Venetia Stanley',
      alternateName: 'Venetia Montagu',
      birthDate: '1887-08-22',
      deathDate: '1948-08-03',
      description: 'British socialite and correspondent of Prime Minister H.H. Asquith.',
      image: 'https://www.thevenetiaproject.com/venetia-without-clementine.png',
    }
  };  

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VenetiaBio />
    </>
  );
}
