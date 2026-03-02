export default function Head() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is Precipice by Robert Harris based on a true story?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Precipice is historical fiction rooted in real people and events, especially the surviving letters between H.H. Asquith and Venetia Stanley, with some scenes and characters dramatized for narrative effect.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}
