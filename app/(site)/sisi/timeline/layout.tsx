import { Metadata } from "next";
import { FAQ_ITEMS } from "./faq";

export const metadata: Metadata = {
  title: "Empress Elisabeth of Austria (Sisi): Complete Biographical Timeline (1837–1898)",
  description:
    "Explore the chronological biography of Empress Elisabeth (Sisi). Trace her Bavarian childhood, marriage to Franz Joseph, Hungarian coronation, Mayerling tragedy, and assassination in Geneva.",
  alternates: {
    canonical: "https://www.thevenetiaproject.com/sisi/timeline",
  },
};

export default function SisiTimelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}