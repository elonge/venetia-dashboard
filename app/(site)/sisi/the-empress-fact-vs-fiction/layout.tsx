import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Is Netflix's 'The Empress' Season 3 a True Story? Fact vs Fiction",
  description:
    "Is Netflix's The Empress Season 3 based on a true story? A complete fact-check of Sisi, Franz Joseph, Count Andrássy, Terese, and Maximilian — verified against Habsburg archives.",
  alternates: {
    canonical: "https://www.thevenetiaproject.com/sisi/the-empress-fact-vs-fiction",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is Netflix's The Empress Season 3 based on a true story?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, loosely. Season 3 follows real historical milestones between 1859 and 1867—Austria's defeat in the Sardinian War, Elisabeth's convalescence abroad, the Austro-Hungarian Compromise of 1867, and Maximilian's execution in Mexico—while inventing major romantic subplots for dramatic tension.",
      },
    },
    {
      "@type": "Question",
      name: "Did Empress Elisabeth have a physical affair with Count Gyula Andrássy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. While contemporary Viennese gossip accused them of being lovers, modern historians agree their relationship was an intense political partnership and close friendship, not a physical affair.",
      },
    },
    {
      "@type": "Question",
      name: "Was Count Andrássy the real father of Archduchess Marie Valerie?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Although Season 3 implies Marie Valerie (born in 1868) might be Andrássy's child, historians reject this court rumor. Marie Valerie strongly resembled Franz Joseph, and surviving correspondence confirms Elisabeth and Andrássy were not physically involved.",
      },
    },
    {
      "@type": "Question",
      name: "Did Franz Joseph have a mistress named Terese and twin sons?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Terese and her twin sons are fictional characters. While Franz Joseph did have discreet affairs during his reign—most notably with Anna Nahowski in the 1870s and 1880s—he did not have secret twins with a lady named Terese after the 1859 war.",
      },
    },
    {
      "@type": "Question",
      name: "Did Sisi really flee Vienna to Corfu because of Franz's infidelity?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Partially. Elisabeth did leave Vienna in late 1860 for a six-month convalescence in Madeira, followed by stays in Corfu in 1861. However, her departure was triggered by severe physical illness, lung complaints, and court exhaustion rather than discovering twin illegitimate children.",
      },
    },
    {
      "@type": "Question",
      name: "Are the letters between Franz Joseph and Sisi real?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Only one side survives in full. Franz Joseph wrote to Elisabeth constantly throughout their marriage, and hundreds of his letters survive in Vienna. Elisabeth, fiercely protective of her privacy, had almost all of her own letters to him destroyed.",
      },
    },
    {
      "@type": "Question",
      name: "Was Ida Ferenczy a real person?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Ida Ferenczy was a real Hungarian noblewoman who became Elisabeth's closest confidante in 1864. She taught Elisabeth Hungarian and acted as her secret political go-between with Count Andrássy and Hungarian leaders.",
      },
    },
    {
      "@type": "Question",
      name: "Did Franz Joseph really lock Elisabeth in her rooms?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The Season 3 finale scene in which Franz Joseph confines Elisabeth to her apartments and restricts supervised access to her children is invented drama.",
      },
    },
    {
      "@type": "Question",
      name: "Did Elisabeth really orchestrate the 1867 Austro-Hungarian Compromise?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, she played a decisive role. Elisabeth worked tirelessly behind the scenes—using Ida Ferenczy as an intermediary with Andrássy and Ferenc Deák—to persuade Franz Joseph to grant Hungary constitutional autonomy, culminating in their coronation in Budapest in June 1867.",
      },
    },
    {
      "@type": "Question",
      name: "Was Archduke Maximilian really executed by firing squad in Mexico?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. After accepting Napoleon III's offer of the Mexican throne in 1864, Maximilian lost French military backing, was captured by Mexican republican forces under Benito Juárez, and was executed by firing squad in Querétaro on June 19, 1867.",
      },
    },
  ],
};

export default function TheEmpressFactVsFictionLayout({
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