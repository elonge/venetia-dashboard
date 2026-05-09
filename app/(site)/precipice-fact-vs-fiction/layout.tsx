import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Is Precipice by Robert Harris a True Story? Fact vs Fiction",
description:
  "Is Precipice by Robert Harris a true story? A complete fact-check of the real Asquith–Venetia Stanley letters, characters, and events — verified against primary sources.",};


const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is Precipice by Robert Harris based on a true story?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Precipice is historical fiction rooted in real people and events, especially the surviving letters between H.H. Asquith and Venetia Stanley, with some scenes and characters dramatized for narrative effect.",
      },
    },
    {
      "@type": "Question",
      name: "Are the Asquith-Venetia Stanley letters real?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. H.H. Asquith wrote to Venetia Stanley up to three times a day, often while sitting at the Cabinet table. Over 500 of these letters survive. Harris uses many of Asquith's actual words in the novel.",
      },
    },
    {
      "@type": "Question",
      name: "Was Paul Deemer a real person?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Paul Deemer is a fictional creation by Robert Harris. While mail surveillance was real during WWI, Deemer himself and his specific role in the story are invented to provide a narrative lens.",
      },
    },
    {
      "@type": "Question",
      name: "Why did Venetia Stanley convert to Judaism?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Venetia converted in order to marry Edwin Montagu, a Jewish Cabinet minister. Edwin's father's will disinherited any child who married outside the Jewish faith, so conversion was a legal and family requirement.",
      },
    },
    {
      "@type": "Question",
      name: "Was the Shells Scandal real?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The Shells Scandal depicted in the book — where the Daily Mail exposed a desperate shortage of munitions on the Front — is entirely historical. It forced Asquith to dissolve his Liberal government and form a Coalition.",
      },
    },
    {
      "@type": "Question",
      name: "Was the affair between Asquith and Venetia Stanley physical?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most historians believe the relationship was deeply emotional but likely not physical. The letters suggest a man in love with a confidante rather than a physical mistress, though historical ambiguity remains.",
      },
    },
    {
      "@type": "Question",
      name: "Did Asquith share secret codes with Venetia Stanley?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Asquith enclosed carbon copies of secret telegrams and reported the contents of Cabinet papers to Venetia. He even asked her for advice on whether to proceed with the Dardanelles expedition.",
      },
    },
    {
      "@type": "Question",
      name: "Did Asquith really throw secrets out of a car window?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Asquith admitted in a private letter to throwing a rolled-up secret document out of a car window as they drove through Roehampton Lane in August 1914.",
      },
    },
    {
      "@type": "Question",
      name: "Did Asquith write to Venetia Stanley during Cabinet meetings?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Out of 425 surviving letters, at least 15 were written while Asquith was on duty — including 4 during Cabinet discussions, 3 during committee meetings, and 6 from the Treasury Bench in the House of Commons.",
      },
    },
    {
      "@type": "Question",
      name: "Did Venetia Stanley reply with advice?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most likely, but her replies are largely missing. Asquith's letters frequently reference her opinions and ask for guidance, suggesting she did offer advice — though we only see it reflected in his responses.",
      },
    },
    {
      "@type": "Question",
      name: "What happened to Venetia Stanley after the book ends?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Venetia married Edwin Montagu in 1915. After his early death in 1924, she lived an independent life, traveling widely and remaining in British social circles until her death in 1948. They had one daughter, Judith.",
      },
    },
    {
      "@type": "Question",
      name: "Is the painting of Venetia Stanley as a nurse real?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The attribution is uncertain. The painting is frequently associated with Venetia in modern reproductions, but the identification is not uniformly sourced. It captures the wartime mood but cannot be confirmed as a portrait of her.",
      },
    },
  ],
};

export default function PrecipiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
