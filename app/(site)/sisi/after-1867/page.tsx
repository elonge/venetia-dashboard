import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { ReactNode } from "react";
import { ArrowRight, BookOpen, CalendarDays, Quote } from "lucide-react";

const PAGE_URL = "https://www.thevenetiaproject.com/sisi/after-1867";

const timeline = [
  {
    date: "8 June 1867",
    title: "Elisabeth is crowned Queen of Hungary in Buda.",
    body:
      "The Austro-Hungarian Compromise marks her greatest political victory—and the last time she actively intervenes in imperial statecraft.",
  },
  {
    date: "22 April 1868",
    title: "Archduchess Marie Valerie is born in Buda.",
    body:
      "Unlike her older children, whom Archduchess Sophie raised, Elisabeth raises Marie Valerie herself and calls her 'the Only One.'",
  },
  {
    date: "1876–1882",
    title: "Elisabeth rides in English and Irish fox-hunting seasons.",
    body:
      "Escorted by Scottish cavalry officer Captain Bay Middleton, she spends winters away from Vienna pursuing grueling equestrian schedules.",
  },
  {
    date: "1886",
    title: "Elisabeth encourages Franz Joseph's friendship with Katharina Schratt.",
    body:
      "Using confidante Ida Ferenczy as go-between, she arranges discreet companionship for the aging Emperor to ease her own guilt over constant travel.",
  },
  {
    date: "30 January 1889",
    title: "Crown Prince Rudolf dies by suicide at Mayerling.",
    body:
      "Her only son's death at age 30 shatters Elisabeth permanently; she wears exclusively black mourning attire for the remaining nine years of her life.",
  },
  {
    date: "1890–1891",
    title: "The Achilleion palace is completed on Corfu.",
    body:
      "Built as a neoclassical sanctuary dedicated to Homer's Achilles, the villa soon loses its appeal as her restlessness drives her back onto ships and trains.",
  },
  {
    date: "10 September 1898",
    title: "Elisabeth is assassinated in Geneva at age 60.",
    body:
      "Traveling incognito with Countess Irma Sztáray, she is fatally stabbed along the Lake Geneva promenade by Italian anarchist Luigi Lucheni.",
  },
] as const;

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What Happened to Sisi After 1867? Empress Elisabeth's Later Life (1868–1898)",
  description:
    "A source-grounded guide to Empress Elisabeth of Austria after Netflix's The Empress ends: Marie Valerie, Katharina Schratt, Mayerling, endless travel, and Geneva.",
  image: ["https://www.thevenetiaproject.com/sisi/elisabeth-last-photo.jpg"],
  mainEntityOfPage: PAGE_URL,
  author: {
    "@type": "Organization",
    name: "The Venetia Project",
  },
  publisher: {
    "@type": "Organization",
    name: "The Venetia Project",
  },
  about: [
    "Empress Elisabeth of Austria",
    "Franz Joseph I of Austria",
    "Archduchess Marie Valerie",
    "Katharina Schratt",
    "Crown Prince Rudolf",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What happened to Empress Elisabeth (Sisi) after 1867?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "After the 1867 Hungarian coronation, Elisabeth withdrew from Viennese court life, gave birth to her youngest daughter Marie Valerie in 1868, traveled relentlessly across Europe and the Mediterranean, arranged Katharina Schratt's companionship for Franz Joseph, and wore perpetual black after Crown Prince Rudolf's suicide in 1889 until her assassination in 1898.",
      },
    },
    {
      "@type": "Question",
      name: "Did Sisi and Franz Joseph stay married after 1867?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, they remained married until her assassination in 1898, though they lived mostly apart. Surviving letters show that Franz Joseph remained deeply devoted to her, while Elisabeth treated him with warm, friend-like affection while insisting on complete personal independence.",
      },
    },
    {
      "@type": "Question",
      name: "Who was Katharina Schratt and did Sisi approve of her?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Katharina Schratt was a Viennese Burgtheater actress who became Franz Joseph's close companion from 1886 until his death. Elisabeth not only approved of the relationship—she actively orchestrated it through her confidante Ida Ferenczy so the Emperor would have warmth and company while Elisabeth traveled.",
      },
    },
    {
      "@type": "Question",
      name: "How did Crown Prince Rudolf die?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "On 30 January 1889, Elisabeth and Franz Joseph's only son, 30-year-old Crown Prince Rudolf, died in a murder-suicide pact with his 17-year-old mistress Baroness Mary Vetsera at the Mayerling hunting lodge outside Vienna.",
      },
    },
    {
      "@type": "Question",
      name: "How and when did Empress Elisabeth die?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "On 10 September 1898, while walking incognito along Lake Geneva with her lady-in-waiting Countess Irma Sztáray, 60-year-old Elisabeth was stabbed in the heart with a sharpened file by Italian anarchist Luigi Lucheni.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "Sisi After 1867: Later Life & Death",
  description:
    "What happened to Sisi after 1867: her daughter Marie Valerie, Katharina Schratt, Crown Prince Rudolf's suicide at Mayerling, and her assassination in Geneva.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "What Happened to Sisi After 1867? Empress Elisabeth's Later Life",
    description:
      "A source-grounded guide to Empress Elisabeth's final three decades: withdrawal from Vienna, Mayerling, private poetry, and Geneva.",
    url: PAGE_URL,
    images: ["/sisi/elisabeth-last-photo.jpg"],
  },
};

type QuoteCardProps = {
  date: string;
  author: string;
  children: ReactNode;
};

type RelatedLinkProps = {
  href: string;
  label: string;
  description: string;
};

function QuoteCard({ date, author, children }: QuoteCardProps) {
  return (
    <figure className="rounded-sm border border-border-beige/60 bg-white/80 p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-gray">
        <Quote size={14} />
        <span>{date}</span>
      </div>
      <blockquote className="text-base leading-relaxed text-navy/90">{children}</blockquote>
      <figcaption className="mt-3 text-sm italic text-stone-500">{author}</figcaption>
    </figure>
  );
}

function RelatedLink({ href, label, description }: RelatedLinkProps) {
  return (
    <Link
      href={href}
      className="group rounded-sm border border-border-beige/60 bg-white/70 p-5 transition-colors hover:border-accent-green/40 hover:bg-white"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-lg font-serif font-semibold text-navy">{label}</p>
        <ArrowRight
          size={16}
          className="shrink-0 text-accent-brown transition-transform group-hover:translate-x-1"
        />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-navy/75">{description}</p>
    </Link>
  );
}

export default function SisiAfter1867Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="bg-page-bg">
        <div className="mx-auto flex max-w-7xl gap-12 px-6 py-12">
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-12 space-y-8">
              <div className="border-b border-border-beige/60 pb-4">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-muted-gray">
                  <BookOpen size={14} />
                  <span>On This Page</span>
                </div>
              </div>

              <nav className="flex flex-col gap-4 text-sm font-medium text-stone-600">
                <a href="#hungarian-child" className="transition-colors hover:text-accent-green">
                  Marie Valerie &amp; Withdrawal
                </a>
                <a href="#katharina-schratt" className="transition-colors hover:text-accent-green">
                  Franz &amp; Katharina Schratt
                </a>
                <a href="#restless-years" className="transition-colors hover:text-accent-green">
                  Travel, Poetry &amp; Rigor
                </a>
                <a href="#mayerling" className="transition-colors hover:text-accent-green">
                  Mayerling &amp; Mourning
                </a>
                <a href="#geneva-1898" className="transition-colors hover:text-accent-green">
                  Assassination in Geneva
                </a>
                <a href="#series-fact-check" className="transition-colors hover:text-accent-green">
                  The Empress Fact-Check
                </a>
                <a href="#sources" className="transition-colors hover:text-accent-green">
                  Sources and Method
                </a>
              </nav>
            </div>
          </aside>

          <article className="min-w-0 max-w-4xl flex-1">
            <header className="mb-12">
              <div className="flex flex-col gap-8 md:flex-row md:items-start">
                <div className="flex-1">
                  <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-accent-brown">
                    <CalendarDays size={14} />
                    <span>Biographical &amp; Historical Guide • Case Study</span>
                  </div>
                  <h1 className="text-4xl font-serif font-bold leading-tight text-navy md:text-5xl">
                    Empress Elisabeth (Sisi): Later Life After 1867 &amp; Aftermath
                  </h1>

                  <div className="mt-5 rounded-sm border-l-4 border-accent-brown bg-stone-50/90 p-4 font-serif text-base leading-relaxed text-navy/90 shadow-sm">
                    <p>
                      <strong>Empress Elisabeth of Austria</strong> (1837–1898) was crowned Queen of Hungary in June 1867. This account follows the three decades that came next: her withdrawal from Vienna, her marriage at a distance, the tragedy at Mayerling, and her assassination in Geneva.
                    </p>
                  </div>

                  <p className="mt-5 text-xl font-serif italic leading-relaxed text-navy/85">
                    From the Hungarian coronation to Katharina Schratt, Mayerling, and the Lake Geneva promenade.
                  </p>
                  <p className="mt-4 max-w-3xl text-base leading-relaxed text-navy/80">
                    Netflix&apos;s <em>The Empress</em> ends at the threshold of 1867, leaving viewers with a triumphant young Queen of Hungary. What followed in history was far stranger and more solitary: an Empress who refused to sit for photographs after age 32, dictated Franz Joseph&apos;s romantic companionship from afar, and spent her final decades fleeing the Hofburg.
                  </p>
                  <p className="mt-4 max-w-3xl text-base leading-relaxed text-navy/80">
                    Why is this on <strong>The Venetia Project</strong>? Like Venetia Stanley in 1914 Britain, Elisabeth is remembered largely through popular myth and the surviving letters of the man who loved her—while her own replies to Franz Joseph were destroyed. For our check of the Netflix series itself, read{" "}
                    <Link
                      href="/sisi/the-empress-fact-vs-fiction"
                      className="font-semibold text-accent-brown underline underline-offset-4 hover:text-accent-green"
                    >
                      The Empress Season 3: Fact vs. Fiction
                    </Link>
                    .
                  </p>
                </div>

                <figure className="w-full md:w-48 md:shrink-0">
                  <Image
                    src="/sisi/elisabeth-last-photo.jpg"
                    alt="Empress Elisabeth of Austria in her last known photograph"
                    width={2697}
                    height={3623}
                    sizes="(min-width: 768px) 192px, 100vw"
                    className="block w-full rounded-sm border-4 border-[#FDFBF7] shadow-md sepia-[0.16] contrast-105 grayscale-[0.06]"
                  />
                  <figcaption className="mt-2 text-sm italic text-stone-500">
                    Elisabeth&apos;s last known photograph, taken shortly before her assassination.
                  </figcaption>
                </figure>
              </div>
            </header>

            <section className="mb-12 grid gap-4 md:grid-cols-4">
              <div className="rounded-sm border border-border-beige/60 bg-white/75 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-gray">
                  Hungarian Crown
                </p>
                <p className="mt-2 text-lg font-serif text-navy">8 June 1867</p>
              </div>
              <div className="rounded-sm border border-border-beige/60 bg-white/75 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-gray">
                  Marie Valerie Born
                </p>
                <p className="mt-2 text-lg font-serif text-navy">22 April 1868</p>
              </div>
              <div className="rounded-sm border border-border-beige/60 bg-white/75 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-gray">
                  Mayerling Tragedy
                </p>
                <p className="mt-2 text-lg font-serif text-navy">30 January 1889</p>
              </div>
              <div className="rounded-sm border border-border-beige/60 bg-white/75 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-gray">
                  Assassination
                </p>
                <p className="mt-2 text-lg font-serif text-navy">10 September 1898</p>
              </div>
            </section>

            <section className="mb-14 rounded-sm border border-border-beige/60 bg-white/65 p-6 md:p-8">
              <div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-muted-gray">
                <CalendarDays size={14} />
                <span>Timeline, 1867 to 1898</span>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {timeline.map((item) => (
                  <div key={item.date} className="border-l-2 border-accent-green/35 pl-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-brown">
                      {item.date}
                    </p>
                    <h3 className="mt-2 text-xl font-serif font-semibold text-navy">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy/80">{item.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="space-y-14">
              <section id="hungarian-child" className="scroll-mt-20">
                <h2 className="text-[1.8rem] font-serif font-semibold leading-tight text-accent-brown md:text-[2rem]">
                  1. &quot;The Hungarian Child&quot; and Retreat from Politics (1868–1875)
                </h2>
                <div className="mt-5 space-y-4 text-base leading-relaxed text-navy/85">
                  <p>
                    The simplest misconception about Elisabeth after 1867 is that the Hungarian coronation turned her into an active co-ruler. It did the opposite. Once the Compromise was signed, Elisabeth stepped permanently away from statecraft. Having broken Archduchess Sophie&apos;s grip on her household, she no longer needed political leverage to secure her personal freedom.
                  </p>
                  <p>
                    On 22 April 1868, she gave birth in Buda to her fourth and final child, Archduchess Marie Valerie. Because Sophie had taken over the upbringing of Elisabeth&apos;s older children—Gisela and Crown Prince Rudolf—Elisabeth treated Marie Valerie as exclusively hers, raising her in Hungary, speaking Hungarian with her, and referring to her in letters as &quot;the Only One.&quot;
                  </p>
                  <p>
                    The intensity of that attachment weighed heavily on Marie Valerie, who later wrote candidly in her diaries about feeling smothered by her mother&apos;s emotional dependence while Rudolf and Gisela remained comparatively distant.
                  </p>
                </div>
              </section>

              <section id="katharina-schratt" className="scroll-mt-20">
                <h2 className="text-[1.8rem] font-serif font-semibold leading-tight text-accent-brown md:text-[2rem]">
                  2. Franz Joseph, Katharina Schratt, and a Marriage Managed from Afar
                </h2>
                <div className="mt-5 space-y-4 text-base leading-relaxed text-navy/85">
                  <p>
                    By the 1880s, Elisabeth spent most of the year away from Vienna—in Hungary, Corfu, Britain, France, and Switzerland—leaving Franz Joseph to his rigid, solitary routine at the Hofburg. Surviving letters confirm a striking emotional asymmetry: Franz Joseph wrote to her constantly with anxious, lifelong devotion, while Elisabeth regarded him with warm, protective friendship rather than romantic desire.
                  </p>
                  <p>
                    To relieve both his loneliness and her own guilt, Elisabeth deliberately orchestrated Franz Joseph&apos;s companionship with Burgtheater actress Katharina Schratt beginning in 1886. Using her Hungarian confidante Ida Ferenczy as a confidential intermediary, Elisabeth arranged meetings, smoothed over misunderstandings, and even corresponded directly with Schratt—whom she affectionately referred to as &quot;the Friend.&quot;
                  </p>
                </div>

                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                  <QuoteCard
                    date="Recorded by Archduchess Marie Valerie"
                    author="Empress Elisabeth on Royal Matrimony"
                  >
                    <p>
                      &quot;Marriage is an absurd institution. One is sold as a fifteen-year-old child and makes a vow one does not understand and then rues for thirty years or more and cannot undo.&quot;
                    </p>
                  </QuoteCard>

                  <div className="rounded-sm border border-border-beige/60 bg-white/75 p-5 shadow-sm">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-gray">
                      Why This Matters
                    </p>
                    <p className="mt-3 text-base leading-relaxed text-navy/85">
                      Rather than a bitter divorce or public scandal, Elisabeth and Franz Joseph negotiated a quiet truce: he funded her endless travels and respected her autonomy, while she ensured he was cared for in Vienna.
                    </p>
                  </div>
                </div>
              </section>

              <section id="restless-years" className="scroll-mt-20">
                <h2 className="text-[1.8rem] font-serif font-semibold leading-tight text-accent-brown md:text-[2rem]">
                  3. Equestrian Obsession, Starvation Diets, and Sealed Poetry
                </h2>
                <div className="mt-5 space-y-4 text-base leading-relaxed text-navy/85">
                  <p>
                    Between 1876 and 1882, Elisabeth became one of the most celebrated—and reckless—fox hunters in Britain and Ireland, riding across Leicestershire and County Meath under the guidance of Scottish cavalry captain Bay Middleton. When sciatica and rheumatism forced her to give up riding in the early 1880s, she replaced hunting with four-to-six-hour forced marches in all weather that left her ladies-in-waiting exhausted.
                  </p>
                  <p>
                    Her private letters to Ida Ferenczy and Marie Valerie document severe body dysmorphia and eating disorders. At 5&apos;8&quot; (172 cm), she kept her weight around 105–110 lbs (48–50 kg) through starvation diets of beef broth, milk, and orange juice, alongside daily gymnastics and multi-hour hair-dressing rituals. After age 32, determined to freeze her public image as eternally young, she refused all new portraits and hid behind leather fans and parasols whenever cameras appeared.
                  </p>
                  <p>
                    Privately, she channeled her disillusionment into hundreds of Heinrich Heine–inspired poems mocking Habsburg court ritual, praising republicanism, and predicting the collapse of European monarchies—manuscripts she sealed in the Swiss Federal Archives with instructions that they remain closed for 60 years after her death.
                  </p>
                </div>
              </section>

              <section id="mayerling" className="scroll-mt-20">
                <h2 className="text-[1.8rem] font-serif font-semibold leading-tight text-accent-brown md:text-[2rem]">
                  4. Mayerling (1889) and Nine Years of Perpetual Black
                </h2>
                <div className="mt-5 space-y-4 text-base leading-relaxed text-navy/85">
                  <p>
                    On 30 January 1889, Elisabeth&apos;s only son, 30-year-old Crown Prince Rudolf, shot his 17-year-old mistress Baroness Mary Vetsera and then himself at the imperial hunting lodge at Mayerling. It was Elisabeth who first broke the news to Franz Joseph in Vienna.
                  </p>
                  <p>
                    Mayerling extinguished whatever attachment to life Elisabeth still possessed. She gave away her jewelry and colored dresses, wore exclusively black mourning clothes for the rest of her life, and adopted the nickname &quot;The Seagull&quot; as she crisscrossed Europe and the Mediterranean on steam yachts and private railway carriages. Even the Achilleion—the lavish Greek-style palace she built on Corfu in 1890–1891—soon felt like another cage, and she spent her final years constantly on the move.
                  </p>
                </div>
              </section>

              <section id="geneva-1898" className="scroll-mt-20">
                <h2 className="text-[1.8rem] font-serif font-semibold leading-tight text-accent-brown md:text-[2rem]">
                  5. Assassination on Lake Geneva (10 September 1898)
                </h2>
                <div className="mt-5 space-y-4 text-base leading-relaxed text-navy/85">
                  <p>
                    In September 1898, Elisabeth was staying in Switzerland incognito under the title &quot;Countess of Hohenembs,&quot; refusing police protection as she always did. Around 1:35 PM on 10 September, she was walking briskly along the Quai du Mont-Blanc in Geneva with a single companion, her Hungarian lady-in-waiting Countess Irma Sztáray, to board a paddle steamer to Montreux.
                  </p>
                  <p>
                    Italian anarchist Luigi Lucheni—who had originally come to Geneva hoping to assassinate Prince Henri of Orléans and settled on Elisabeth after a local newspaper revealed her presence—stepped into her path, peered under her parasol, and plunged a sharpened triangular file into her chest.
                  </p>
                  <p>
                    Because her tightly laced corset temporarily compressed the tiny puncture wound into her heart, Elisabeth stood back up, walked onto the steamer <em>Genève</em>, and collapsed only after the boat left the dock. She died shortly after being carried back to the Hôtel Beau-Rivage, aged 60—fulfilling the quick, painless death she had repeatedly wished for in her late letters.
                  </p>
                </div>
              </section>

              <section id="series-fact-check" className="scroll-mt-20">
                <h2 className="text-[1.8rem] font-serif font-semibold leading-tight text-accent-brown md:text-[2rem]">
                  6. Netflix&apos;s The Empress — How Accurate Is the Series?
                </h2>
                <div className="mt-5 space-y-4 text-base leading-relaxed text-navy/85">
                  <p>
                    Most viewers arrive at Elisabeth&apos;s later life through Netflix&apos;s <em>The Empress</em>, which dramatizes her marriage and political struggles from 1853 through the 1867 Hungarian coronation. While the series captures the suffocating hostility of the Viennese court, it invents major romantic subplots—including physical affairs for both Elisabeth and Franz Joseph—that contradict surviving Habsburg correspondence.
                  </p>
                  <div className="mt-6 flex flex-col items-start gap-2">
                    <Link
                      href="/sisi/the-empress-fact-vs-fiction"
                      className="mt-5 inline-flex items-center gap-2 rounded-sm border border-accent-brown/25 bg-accent-brown/80 px-6 py-3 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(122,58,20,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#63300F]"
                    >
                      Read The Empress Season 3 fact-vs-fiction guide
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </section>

              <section className="rounded-sm border border-border-beige/60 bg-white/70 p-6 md:p-8">
                <h2 className="text-[1.6rem] font-serif font-semibold leading-tight text-navy">
                  Related Reading
                </h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <RelatedLink
                    href="/sisi/the-empress-fact-vs-fiction"
                    label="The Empress Season 3: Fact vs. Fiction"
                    description="Checking Count Andrássy, Terese, Marie Valerie's paternity, and Maximilian against primary sources."
                  />
                  <RelatedLink
                    href="/sisi/timeline"
                    label="Timeline of Elisabeth's Life"
                    description="Key events in Elisabeth's life, alongside relevant historical context."
                  />
                  <RelatedLink
                    href="/"
                    label="Venetia Stanley and Asquith letters"
                    description="Our parallel study of another woman whose private letters disappeared behind public legend."
                  />
                  <RelatedLink
                    href="/precipice-fact-vs-fiction"
                    label="Is Precipice a True Story?"
                    description="Fact-checking Robert Harris's novel against H.H. Asquith's surviving wartime letters."
                  />
                </div>
              </section>

              <section id="sources" className="border-t border-border-beige/60 pt-8">
                <h2 className="text-[1.6rem] font-serif font-semibold leading-tight text-navy">
                  Sources and Method
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-navy/80">
                  <p>
                    This guide draws on primary Habsburg archival editions and modern scholarly biographies: Brigitte Hamann&apos;s <em>Elisabeth: Kaiserin wider Willen</em> (English: <em>The Reluctant Empress</em>) and <em>Das poetische Tagebuch</em> (Elisabeth&apos;s sealed Swiss Federal Archives poems), Beatrix Meyer&apos;s annotated edition of Elisabeth&apos;s surviving letters to Ida Ferenczy (<em>Kaiserin Elisabeth ganz privat</em>), Martha Schad&apos;s edition of Archduchess Marie Valerie&apos;s diaries, Georg Nostitz-Rieneck&apos;s two-volume edition of Franz Joseph&apos;s letters to Elisabeth, and Countess Irma Sztáray&apos;s 1909 eyewitness memoir of Geneva.
                  </p>
                  <p>
                    As throughout The Venetia Project, we distinguish between documented correspondence (such as Franz Joseph&apos;s surviving letters and Elisabeth&apos;s letters to Ida Ferenczy) and court gossip (such as rumors surrounding Marie Valerie&apos;s paternity or alleged lovers during her travels), which modern historians reject.
                  </p>
                </div>
              </section>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
