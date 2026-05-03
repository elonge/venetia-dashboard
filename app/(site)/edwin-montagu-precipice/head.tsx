// FAQ schema is included in the route layout; this duplicate head export is kept to mirror legacy route structure.
export default function Head() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Was Edwin Montagu a real person?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Edwin Samuel Montagu (1879-1924) was a real British Liberal politician, MP, and Secretary of State for India. He was also Venetia Stanley's husband.",
        },
      },
      {
        "@type": "Question",
        name: "What did Edwin Montagu look like?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Contemporaries often described Montagu as physically awkward and self-conscious about his appearance, including his teeth. His letters and remarks show a notably self-deprecating streak.",
        },
      },
      {
        "@type": "Question",
        name: "Did Edwin Montagu really love Venetia Stanley?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most historical accounts indicate he did. Their marriage was complicated, but his correspondence and behavior suggest genuine emotional commitment.",
        },
      },
      {
        "@type": "Question",
        name: "Why did Venetia Stanley marry Edwin Montagu?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Historians cite multiple motives: personal affection, social and family strategy, and a desire to leave the intense Asquith-Venetia dynamic. There is no single definitive explanation.",
        },
      },
      {
        "@type": "Question",
        name: "Was Edwin Montagu Jewish and what was his stance on Zionism?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Montagu was Jewish. He opposed political Zionism and warned that the Balfour Declaration risked implying Jews were a separate nationality rather than full citizens of their home countries.",
        },
      },
      {
        "@type": "Question",
        name: "Did Edwin Montagu know about Asquith's letters to Venetia?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "He likely understood the closeness of the relationship, but the degree of his knowledge about specific letters and sensitive content remains debated.",
        },
      },
      {
        "@type": "Question",
        name: "What happened to Edwin Montagu after Venetia married him?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "He remained a major political figure as Secretary of State for India and helped shape the Montagu-Chelmsford reforms. His marriage faced strain, and he died relatively young in 1924.",
        },
      },
      {
        "@type": "Question",
        name: "How did Edwin Montagu die?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Edwin Montagu died in 1924 at age 44 after a period of ill health.",
        },
      },
      {
        "@type": "Question",
        name: "How accurate is Harris's portrayal of Edwin Montagu in Precipice?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Harris captures core historical dynamics but writes as a novelist. The broad outline is rooted in real events, while emotional texture and private scenes are partly dramatized.",
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
