import { Metadata } from "next";
import { FAQ_ITEMS } from "./faq";

export const metadata: Metadata = {
  title: "Franz von Papen: Chancellor, Hitler's Vice-Chancellor & Downfall",
  description:
    "How did Franz von Papen help Hitler rise to power — and survive? A timeline of his chancellorship, the Night of the Long Knives, Nuremberg acquittal, and legacy.",
};

export default function FranzVonPapenLayout({
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