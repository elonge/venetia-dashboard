import { Metadata } from 'next';
import VenetiaBio from './VenetiaBio';

export const metadata: Metadata = {
  title: 'Venetia Stanley — The Woman Behind the Letters',
  description:
    'Venetia Stanley in her own words and those of her contemporaries. Explore rare 1928 footage, photographs, letters, and other archival material',

  openGraph: {
    title: 'Venetia Stanley — The Woman Behind the Letters',
    description:
      'Venetia Stanley in her own words and those of her contemporaries. Explore rare 1928 footage, photographs, letters, and other archival material',
    images: ['/venetia-without-clementine.png'],
  },

  // Helps Google surface this page for "venetia stanley" Knowledge Panel queries
  alternates: {
    canonical: 'https://www.thevenetiaproject.com/venetia',
  },
};

export default function VenetiaPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: 'Venetia Stanley — The Venetia Project',
    url: 'https://www.thevenetiaproject.com/venetia',
    mainEntity: {
      '@type': 'Person',
      name: 'Venetia Stanley',
      alternateName: ['Venetia Montagu', 'Beatrice Venetia Stanley'],
      birthDate: '1887-08-22',
      deathDate: '1948-08-03',
      birthPlace: {
        '@type': 'Place',
        name: 'Alderley Edge, Cheshire, England',
      },
      deathPlace: {
        '@type': 'Place',
        name: 'London, England',
      },
      description:
        'British socialite and the principal correspondent of Prime Minister H.H. Asquith during World War I. She married Edwin Montagu, Secretary of State for India, in 1915.',
      image: 'https://www.thevenetiaproject.com/venetia-without-clementine.png',
      spouse: {
        '@type': 'Person',
        name: 'Edwin Montagu',
        url: 'https://www.thevenetiaproject.com/edwin-montagu-precipice',
      },
      // Ties Venetia to her Wikipedia / Wikidata identity — helps Google's Knowledge Graph
      sameAs: [
        'https://en.wikipedia.org/wiki/Venetia_Stanley',
      ],
      knowsAbout: [
        'H.H. Asquith',
        'World War I British politics',
        'Edwardian society',
        'Edwin Montagu',
      ],
    },
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