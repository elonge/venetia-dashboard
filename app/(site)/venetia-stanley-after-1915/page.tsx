import Link from "next/link";
import { Metadata } from "next";
import { ReactNode } from "react";
import { ArrowRight, BookOpen, CalendarDays, Quote } from "lucide-react";

const PAGE_URL = "https://www.thevenetiaproject.com/venetia-stanley-after-1915";

const timeline = [
  {
    date: "26 July 1915",
    title: "Venetia Stanley marries Edwin Montagu.",
    body:
      "The Asquith-Venetia crisis ends in formal terms, but the emotional and political fallout keeps moving through the next decade.",
  },
  {
    date: "1917-1919",
    title: "Montagu reaches the height of his political career.",
    body:
      "As Secretary of State for India, he becomes a major public figure even as the marriage itself grows more strained.",
  },
  {
    date: "1919",
    title: "Later biographical accounts place the Beaverbrook affair here.",
    body:
      "By this point Venetia's married life and her wider social life are no longer easy to separate.",
  },
  {
    date: "6 February 1923",
    title: "Judith Montagu is born.",
    body:
      "Her birth becomes one of the most discussed parts of Venetia's later life, especially in retrospect.",
  },
  {
    date: "15 November 1924",
    title: "Edwin Montagu dies.",
    body:
      "Widowhood changes Venetia's position completely: socially, financially, and emotionally.",
  },
  {
    date: "1 November 1927",
    title: "Asquith writes after visiting Venetia at Breccles.",
    body:
      "The surviving letter shows that some form of affectionate contact had been rebuilt by the end of both their stories.",
  },
  {
    date: "3 August 1948",
    title: "Venetia Stanley dies.",
    body:
      "By then she had outlived Montagu, outlived Asquith, and become a figure remembered as much for later rumor as for wartime intimacy.",
  },
] as const;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What happened to Venetia Stanley after 1915?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "After marrying Edwin Montagu in 1915, Venetia spent the next decade in an increasingly strained marriage, moved through elite political and social circles, had a daughter in 1923, was widowed in 1924, and remained a socially mobile, controversial figure until her death in 1948.",
      },
    },
    {
      "@type": "Question",
      name: "Did Venetia Stanley stay married to Edwin Montagu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The marriage lasted until Montagu's death in November 1924, though by most accounts it was unhappy and marked by Venetia's affairs and Montagu's continued devotion.",
      },
    },
    {
      "@type": "Question",
      name: "Did Venetia Stanley have an affair with Lord Beaverbrook?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Later biographical accounts and existing project summaries describe a long affair with Lord Beaverbrook beginning around 1919. The surviving direct correspondence used on this site is thinner here than it is for 1914-1915, so the claim rests more on later synthesis than on one decisive letter.",
      },
    },
    {
      "@type": "Question",
      name: "Was Judith Montagu really Edwin Montagu's daughter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "That question has generated decades of gossip. Later accounts often link Judith's paternity to the Dudley circle rather than to Edwin Montagu, but the surviving material used here is better at recording rumor than at proving it conclusively.",
      },
    },
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What Happened to Venetia Stanley? Her Later Life After 1915",
  description:
    "A source-grounded guide to Venetia Stanley's later life: the Montagu marriage years, widowhood, the Beaverbrook affair, and the Judith Montagu/Dudley question.",
  image: ["https://www.thevenetiaproject.com/venetia_and_her_daughter.jpg"],
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
    "Venetia Stanley",
    "Edwin Montagu",
    "Lord Beaverbrook",
    "Judith Montagu",
    "Earl of Dudley",
  ],
};

export const metadata: Metadata = {
  title: "What Happened to Venetia Stanley? Her Later Life After 1915",
  description:
    "Venetia Stanley's later life after 1915: the Montagu marriage years, widowhood, Beaverbrook, Judith, and the Dudley paternity question.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "What Happened to Venetia Stanley? Her Later Life After 1915",
    description:
      "A source-grounded guide to Venetia Stanley's later life, marriage, widowhood, affairs, and daughter Judith.",
    url: PAGE_URL,
    images: ["/venetia_and_her_daughter.jpg"],
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
        <ArrowRight size={16} className="shrink-0 text-accent-brown transition-transform group-hover:translate-x-1" />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-navy/75">{description}</p>
    </Link>
  );
}

export default function VenetiaStanleyAfter1915Page() {
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
                <a href="#marriage-years" className="transition-colors hover:text-accent-green">
                  The Marriage Years
                </a>
                <a href="#widowhood" className="transition-colors hover:text-accent-green">
                  Montagu's Death
                </a>
                <a href="#beaverbrook" className="transition-colors hover:text-accent-green">
                  Beaverbrook and Society
                </a>
                <a href="#judith" className="transition-colors hover:text-accent-green">
                  Judith and Dudley
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
                    <span>Later Life Guide</span>
                  </div>
                  <h1 className="text-4xl font-serif font-bold leading-tight text-navy md:text-5xl">
                    What Happened to Venetia Stanley? Her Later Life After 1915
                  </h1>
                  <p className="mt-5 text-xl font-serif italic leading-relaxed text-navy/85">
                    The marriage years, the widowhood, the Beaverbrook affair, and the long afterlife of the Judith rumor.
                  </p>
                  <p className="mt-5 max-w-3xl text-base leading-relaxed text-navy/80">
                    Search interest around Venetia Stanley usually does not stop with the Asquith
                    letters. Readers want to know what came next: whether the marriage worked,
                    what widowhood changed, how she lived in the 1920s, and why her daughter Judith
                    became the center of so much gossip. This page answers those questions directly,
                    while staying honest about where the surviving record is rich and where it is thin.
                  </p>
                </div>

                <figure className="w-full md:w-48 md:shrink-0">
                  <img
                    src="/venetia_and_her_daughter.jpg"
                    alt="Venetia Stanley with her daughter Judith"
                    className="block w-full rounded-sm border-4 border-[#FDFBF7] shadow-md sepia-[0.16] contrast-105 grayscale-[0.06]"
                  />
                  <figcaption className="mt-2 text-sm italic text-stone-500">
                    Venetia Stanley with her daughter Judith, the figure around whom later rumor clustered.
                  </figcaption>
                </figure>
              </div>
            </header>

            <section className="mb-12 grid gap-4 md:grid-cols-4">
              <div className="rounded-sm border border-border-beige/60 bg-white/75 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-gray">
                  Marriage
                </p>
                <p className="mt-2 text-lg font-serif text-navy">1915-1924</p>
              </div>
              <div className="rounded-sm border border-border-beige/60 bg-white/75 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-gray">
                  Judith Born
                </p>
                <p className="mt-2 text-lg font-serif text-navy">6 February 1923</p>
              </div>
              <div className="rounded-sm border border-border-beige/60 bg-white/75 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-gray">
                  Widowed
                </p>
                <p className="mt-2 text-lg font-serif text-navy">15 November 1924</p>
              </div>
              <div className="rounded-sm border border-border-beige/60 bg-white/75 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-gray">
                  Final Asquith Visit
                </p>
                <p className="mt-2 text-lg font-serif text-navy">November 1927</p>
              </div>
            </section>

            <section className="mb-14 rounded-sm border border-border-beige/60 bg-white/65 p-6 md:p-8">
              <div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-muted-gray">
                <CalendarDays size={14} />
                <span>Timeline, 1915 to 1948</span>
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
              <section id="marriage-years" className="scroll-mt-20">
                <h2 className="text-[1.8rem] font-serif font-semibold leading-tight text-accent-brown md:text-[2rem]">
                  1. The Montagu Marriage Years (1915-1924)
                </h2>
                <div className="mt-5 space-y-4 text-base leading-relaxed text-navy/85">
                  <p>
                    The simplest mistake about Venetia after 1915 is to imagine that marriage closed
                    the story. It did not. It merely changed the cast. Edwin Montagu went on to the
                    high point of his public life, culminating in the India Office. Venetia, meanwhile,
                    moved into a marriage that by most later accounts was companionable only in bursts
                    and structurally unhappy.
                  </p>
                  <p>
                    The contrast matters. Publicly, the Montagus were a Cabinet couple. Privately,
                    the marriage seems to have been marked by distance, by Edwin's persistent devotion,
                    and by Venetia's desire for freedom, excitement, and other attachments. Existing
                    project material is consistent on that point even when the surviving direct letters
                    thin out after the war years.
                  </p>
                  <p>
                    So the answer to "what happened to Venetia Stanley?" begins here: she did not vanish
                    into respectable obscurity. She became Venetia Montagu, but not in a way that erased
                    the traits already visible in the 1910s: restlessness, appetite for society, and a
                    refusal to be confined by other people's moral scripts.
                  </p>
                </div>

                <figure className="mt-8 rounded-sm border border-border-beige/60 bg-white/75 p-4 shadow-sm">
                  <img
                    src="/venetia_marriage.png"
                    alt="Venetia Stanley and Edwin Montagu around the time of their marriage"
                    className="block w-full rounded-sm sepia-[0.18] contrast-105 grayscale-[0.08]"
                  />
                  <figcaption className="mt-3 text-sm italic leading-relaxed text-stone-500">
                    The marriage mattered historically, but it did not settle Venetia into a quiet life.
                  </figcaption>
                </figure>
              </section>

              <section id="widowhood" className="scroll-mt-20">
                <h2 className="text-[1.8rem] font-serif font-semibold leading-tight text-accent-brown md:text-[2rem]">
                  2. Montagu&apos;s Death and Her Liberation
                </h2>
                <div className="mt-5 space-y-4 text-base leading-relaxed text-navy/85">
                  <p>
                    Edwin Montagu died in November 1924. That matters not only as a biographical date
                    but as a social turning point. "Liberation" is the useful word here if it is used
                    precisely: widowhood gave Venetia more freedom of movement, more autonomy in arranging
                    her private life, and less obligation to perform a marriage that had long since ceased
                    to look secure.
                  </p>
                  <p>
                    It also reopened older relationships in altered form. The great wartime epistolary
                    obsession with Asquith was never revived as it had been in 1914-1915, but later contact
                    did resume. By November 1927, Asquith could still write to her with an old warmth that
                    shows how much of the emotional bond remained, even after everything else had changed.
                  </p>
                </div>

                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                  <QuoteCard date="1 November 1927" author="H.H. Asquith to Venetia Stanley">
                    <p>
                      &quot;It was with a sad heart &amp; heavy feet that I turned my back upon Breccles:
                      I had enjoyed every minute of my little visit.&quot;
                    </p>
                    <p className="mt-3">
                      He adds that he is sending love to Judith, &quot;whose acquaintance I should like
                      to improve.&quot;
                    </p>
                  </QuoteCard>

                  <div className="rounded-sm border border-border-beige/60 bg-white/75 p-5 shadow-sm">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-gray">
                      Why This Matters
                    </p>
                    <p className="mt-3 text-base leading-relaxed text-navy/85">
                      That 1927 letter is not a lover&apos;s wartime panic. It is something later and quieter:
                      a sign that Venetia, now a widow, was again inhabiting a social world in which Asquith
                      could visit, remember, and take comfort.
                    </p>
                  </div>
                </div>
              </section>

              <section id="beaverbrook" className="scroll-mt-20">
                <h2 className="text-[1.8rem] font-serif font-semibold leading-tight text-accent-brown md:text-[2rem]">
                  3. The Beaverbrook Affair and Her Social Life
                </h2>
                <div className="mt-5 space-y-4 text-base leading-relaxed text-navy/85">
                  <p>
                    Later biographical accounts place a long affair with Lord Beaverbrook at the center
                    of Venetia&apos;s postwar social life, usually beginning around 1919. This is one of those
                    topics where the record used on this site is less direct than it is for the Asquith years.
                    We are dealing more with synthesis and remembered pattern than with a single bombshell letter.
                  </p>
                  <p>
                    Still, the broad picture is consistent. Venetia did not become a dutiful political wife
                    in retreat. She remained in the orbit of powerful men, lively houses, money, journalism,
                    and clever talk. Beaverbrook fits that world perfectly: a press baron, a political operator,
                    and the sort of man whose energy and resources matched the scale on which Venetia liked to live.
                  </p>
                  <p>
                    What makes this historically interesting is that her later social life was not mere decoration.
                    It connected her to press power, Cabinet memory, and the postwar elite salon culture that replaced
                    the pre-1914 coterie world. In other words, Venetia&apos;s afterlife was still political, even when it
                    looked purely social from the outside.
                  </p>
                </div>
              </section>

              <section id="judith" className="scroll-mt-20">
                <h2 className="text-[1.8rem] font-serif font-semibold leading-tight text-accent-brown md:text-[2rem]">
                  4. Her Daughter Judith and the Earl of Dudley Question
                </h2>
                <div className="mt-5 space-y-4 text-base leading-relaxed text-navy/85">
                  <p>
                    Judith Montagu, born on 6 February 1923, is central to the search history around Venetia
                    because she carries the story into the next generation and because her paternity became a long-lived
                    piece of society gossip. That gossip matters historically not because gossip is proof, but because
                    it shows how Venetia was remembered: as a woman whose married life was assumed to be unconventional
                    enough that even her daughter&apos;s paternity could be publicly doubted.
                  </p>
                  <p>
                    Existing material in this project is not perfectly tidy on the name attached to that rumor. Some
                    notes reduce it to &quot;Lord Eric Dudley,&quot; while other summaries point to the Dudley line more
                    specifically, usually William Humble Eric Ward, then Viscount Ednam and later the 3rd Earl of Dudley.
                    The careful conclusion is therefore limited: later rumor connected Judith to the Dudley circle rather
                    than securely to Edwin Montagu, but the archive here records the gossip more clearly than it proves the fact.
                  </p>
                  <p>
                    That distinction is important. Search pages often flatten this into a neat answer. Historical rigor
                    requires a messier one: Judith&apos;s paternity became part of Venetia&apos;s legend, but legend is not the
                    same thing as contemporaneous demonstration.
                  </p>
                </div>

                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                  <figure className="rounded-sm border border-border-beige/60 bg-white/75 p-4 shadow-sm">
                    <img
                      src="/venetia_and_her_daughter.jpg"
                      alt="Venetia Stanley with Judith Montagu"
                      className="block w-full rounded-sm sepia-[0.12] contrast-105 grayscale-[0.04]"
                    />
                    <figcaption className="mt-3 text-sm italic leading-relaxed text-stone-500">
                      Judith turns the story from wartime intimacy into interwar inheritance, gossip, and memory.
                    </figcaption>
                  </figure>

                  <div className="rounded-sm border border-border-beige/60 bg-white/75 p-5 shadow-sm">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-gray">
                      The Safe Historical Answer
                    </p>
                    <p className="mt-3 text-base leading-relaxed text-navy/85">
                      Judith was Venetia&apos;s daughter. Rumors long circulated that Edwin Montagu was not the father.
                      Later retellings attach the story to the Dudley family. The surviving material used on this site
                      does not justify a more categorical statement than that.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-sm border border-border-beige/60 bg-white/70 p-6 md:p-8">
                <h2 className="text-[1.6rem] font-serif font-semibold leading-tight text-navy">
                  Related Reading
                </h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <RelatedLink
                    href="/venetia-stanley-edwin-montagu-marriage"
                    label="The Marriage of Venetia Stanley and Edwin Montagu"
                    description="The 1915 wedding, conversion, courtship timeline, and Asquith's reaction."
                  />
                  <RelatedLink
                    href="/chapter/after-breakup"
                    label="After the Breakup"
                    description="The project chapter on estrangement, reconciliation, and the Montagus after 1915."
                  />
                  <RelatedLink
                    href="/edwin-montagu-precipice"
                    label="Who Was Edwin Montagu?"
                    description="Montagu's politics, marriage, decline, and death in one wider guide."
                  />
                  <RelatedLink
                    href="/precipice-fact-vs-fiction"
                    label="What Happened After the Book?"
                    description="The broader fact-check page for readers arriving from Robert Harris's Precipice."
                  />
                </div>
              </section>

              <section id="sources" className="border-t border-border-beige/60 pt-8">
                <h2 className="text-[1.6rem] font-serif font-semibold leading-tight text-navy">
                  Sources and Method
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-navy/80">
                  <p>
                    This page combines the surviving Asquith-Venetia material used throughout the project
                    with Cynthia Asquith&apos;s diary, the project&apos;s chapter summaries, and later biographical
                    syntheses about the Montagu marriage and interwar years.
                  </p>
                  <p>
                    The evidentiary balance is uneven. The sections on marriage aftermath and Asquith&apos;s last
                    visit rest on surviving correspondence and diary material. The Beaverbrook section and the
                    Judith/Dudley question rely more heavily on later summaries and retrospective gossip. That
                    difference is intentional and is reflected in how cautiously the page is written.
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
