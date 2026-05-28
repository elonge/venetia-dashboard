import Link from "next/link";
import { Metadata } from "next";
import { ReactNode } from "react";
import { ArrowRight, BookOpen, CalendarDays, Quote } from "lucide-react";

const PAGE_URL = "https://www.thevenetiaproject.com/venetia-stanley-edwin-montagu-marriage";

const timeline = [
  {
    date: "20 April 1915",
    title: "Venetia admits that Asquith stands in the way.",
    body:
      "Writing to Edwin Montagu, she says she feels 'very bitterly' that the Prime Minister should block the marriage, even while she still feels guilty toward him.",
  },
  {
    date: "21 April 1915",
    title: "Montagu presses for a decision.",
    body:
      "Montagu tells Venetia that they 'must find' a way out and should not waste more time.",
  },
  {
    date: "12 May 1915",
    title: "Asquith learns the engagement is real.",
    body:
      "He tells Venetia, 'this breaks my heart,' and describes the match to Sylvia Henley as a 'death-blow'.",
  },
  {
    date: "6 June 1915",
    title: "Venetia defines conversion as a label, not an inner change.",
    body:
      "She tells Montagu she will comply, but insists she will never think of herself as Jewish in a spiritual or national sense.",
  },
  {
    date: "12 July 1915",
    title: "Venetia is formally received into the Jewish faith.",
    body:
      "By this point the conversion is a legal and family necessity for the marriage settlement, not a devotional turning point.",
  },
  {
    date: "24 July 1915",
    title: "Asquith chooses not to say goodbye in person.",
    body:
      "Two days before the wedding, he writes that it is better for both of them not to meet.",
  },
  {
    date: "26 July 1915",
    title: "Wedding day.",
    body:
      "Venetia Stanley and Edwin Montagu marry with Jewish rites at Lord Swaythling's house. Asquith does not attend.",
  },
] as const;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "When did Venetia Stanley marry Edwin Montagu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Venetia Stanley married Edwin Montagu on 26 July 1915.",
      },
    },
    {
      "@type": "Question",
      name: "Why did Venetia Stanley convert to Judaism?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "She converted so the marriage would satisfy the Montagu family settlement and inheritance terms. Her own letters make clear that she treated the conversion as a nominal label rather than a deep religious change.",
      },
    },
    {
      "@type": "Question",
      name: "Did H.H. Asquith attend Venetia Stanley's wedding?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Asquith did not attend the wedding, though he later sent silver boxes as a gift.",
      },
    },
    {
      "@type": "Question",
      name: "Why do people search for Edwin Montagu's teeth or appearance?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Because hostile contemporaries, especially Asquith, wrote cruelly about Montagu's looks. The more historically revealing point is not a single feature but the way appearance, nerves, and antisemitic bias were blended together in elite private correspondence.",
      },
    },
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The Marriage of Venetia Stanley and Edwin Montagu (1915)",
  description:
    "A source-grounded account of Venetia Stanley's 1915 marriage to Edwin Montagu: the courtship, Asquith's heartbreak, the conversion to Judaism, and the wedding day.",
  image: ["https://www.thevenetiaproject.com/venetia_marriage.png"],
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
    "H.H. Asquith",
    "Jewish conversion",
    "Edwardian politics",
  ],
};

export const metadata: Metadata = {
  title: "The Marriage of Venetia Stanley and Edwin Montagu (1915)",
  description:
    "Courtship, conversion, wedding day, and Asquith's reaction: a primary-source guide to Venetia Stanley's marriage to Edwin Montagu.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "The Marriage of Venetia Stanley and Edwin Montagu (1915)",
    description:
      "A primary-source guide to the courtship, conversion, and wedding of Venetia Stanley and Edwin Montagu.",
    url: PAGE_URL,
    images: ["/venetia_marriage.png"],
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

export default function VenetiaStanleyEdwinMontaguMarriagePage() {
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
                <a href="#courtship" className="transition-colors hover:text-accent-green">
                  Courtship and Despair
                </a>
                <a href="#appearance" className="transition-colors hover:text-accent-green">
                  Montagu and the "Teeth" Query
                </a>
                <a href="#conversion" className="transition-colors hover:text-accent-green">
                  Conversion to Judaism
                </a>
                <a href="#wedding-day" className="transition-colors hover:text-accent-green">
                  The Wedding Day
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
                    <span>Historical Guide</span>
                  </div>
                  <h1 className="text-4xl font-serif font-bold leading-tight text-navy md:text-5xl">
                    The Marriage of Venetia Stanley and Edwin Montagu (1915)
                  </h1>
                  <p className="mt-5 text-xl font-serif italic leading-relaxed text-navy/85">
                    A source-grounded account of the courtship, the conversion, the wedding,
                    and the emotional wreckage left behind in Asquith&apos;s letters.
                  </p>
                  <p className="mt-5 max-w-3xl text-base leading-relaxed text-navy/80">
                    This page is built from the surviving correspondence between H.H. Asquith,
                    Venetia Stanley, Edwin Montagu, and Sylvia Henley, together with Cynthia
                    Asquith&apos;s diary. The key Montagu material comes from the Trinity College
                    Cambridge archive, including Series MONT II, so the aim here is not gossip
                    but chronology, quotation, and context.
                  </p>
                </div>

                <figure className="w-full md:w-44 md:shrink-0">
                  <img
                    src="/venetia_marriage.png"
                    alt="Venetia Stanley and Edwin Montagu on their wedding day in 1915"
                    className="block w-full rounded-sm border-4 border-[#FDFBF7] shadow-md sepia-[0.18] contrast-105 grayscale-[0.08]"
                  />
                  <figcaption className="mt-2 text-sm italic text-stone-500">
                    Venetia Stanley and Edwin Montagu, photographed around the time of their marriage.
                  </figcaption>
                </figure>
              </div>
            </header>

            <section className="mb-12 grid gap-4 md:grid-cols-4">
              <div className="rounded-sm border border-border-beige/60 bg-white/75 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-gray">
                  Wedding Date
                </p>
                <p className="mt-2 text-lg font-serif text-navy">26 July 1915</p>
              </div>
              <div className="rounded-sm border border-border-beige/60 bg-white/75 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-gray">
                  Ceremony
                </p>
                <p className="mt-2 text-lg font-serif text-navy">Jewish rites at Lord Swaythling&apos;s house</p>
              </div>
              <div className="rounded-sm border border-border-beige/60 bg-white/75 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-gray">
                  Conversion
                </p>
                <p className="mt-2 text-lg font-serif text-navy">Formal reception on 12 July 1915</p>
              </div>
              <div className="rounded-sm border border-border-beige/60 bg-white/75 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-gray">
                  Asquith
                </p>
                <p className="mt-2 text-lg font-serif text-navy">Did not attend the wedding</p>
              </div>
            </section>

            <section className="mb-14 rounded-sm border border-border-beige/60 bg-white/65 p-6 md:p-8">
              <div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-muted-gray">
                <CalendarDays size={14} />
                <span>Timeline, April to July 1915</span>
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
              <section id="courtship" className="scroll-mt-20">
                <h2 className="text-[1.8rem] font-serif font-semibold leading-tight text-accent-brown md:text-[2rem]">
                  The Courtship and Asquith&apos;s Despair
                </h2>
                <div className="mt-5 space-y-4 text-base leading-relaxed text-navy/85">
                  <p>
                    The important point about spring 1915 is not simply that Edwin Montagu was
                    proposing while Asquith was still writing love letters. It is that the two
                    conversations overlap almost day by day. On 20 April, Venetia tells Montagu
                    that she resents the Prime Minister for standing in the way. On 21 April,
                    Montagu insists that they should not drift for another three years. By 12 May,
                    the engagement is no longer hypothetical and Asquith is writing as a man who
                    knows he has lost her.
                  </p>
                  <p>
                    That compressed timeline matters because it explains why the marriage felt so
                    explosive to contemporaries. To Asquith, this was not a distant social match.
                    It was the collapse of the private correspondence on which he had come to rely
                    in the middle of war.
                  </p>
                </div>

                <div className="mt-8 grid gap-5 lg:grid-cols-3">
                  <QuoteCard date="20 April 1915" author="Venetia Stanley to Edwin Montagu">
                    <p>
                      &quot;I feel so ungrateful to him &amp; yet at times I resent very bitterly that
                      he should stand in the way.&quot;
                    </p>
                    <p className="mt-3">
                      &quot;In spite of the fact that you&apos;ve again &amp; again told me that if I were
                      to marry life would have nothing left to offer you, I am going to marry Edwin.&quot;
                    </p>
                  </QuoteCard>

                  <QuoteCard date="21 April 1915" author="Edwin Montagu to Venetia Stanley">
                    <p>
                      &quot;As regards the Prime. I can&apos;t see the way out - but best beloved, we must
                      find one ... for we ought not to waste time.&quot;
                    </p>
                    <p className="mt-3">
                      &quot;If you are brave enough to come into the fold, right in.&quot;
                    </p>
                  </QuoteCard>

                  <QuoteCard date="12 May 1915" author="H.H. Asquith to Venetia Stanley and Sylvia Henley">
                    <p>&quot;Most Loved - As you know well, this breaks my heart.&quot;</p>
                    <p className="mt-3">
                      To Sylvia he calls the match a &quot;death-blow&quot; and says the two people most
                      devoted to him have combined to deal it.
                    </p>
                  </QuoteCard>
                </div>
              </section>

              <section id="appearance" className="scroll-mt-20">
                <h2 className="text-[1.8rem] font-serif font-semibold leading-tight text-accent-brown md:text-[2rem]">
                  Contemporary Views on Edwin Montagu (and the &quot;Teeth&quot; Query)
                </h2>
                <div className="mt-5 space-y-4 text-base leading-relaxed text-navy/85">
                  <p>
                    Modern readers often land here looking for a simple answer to searches like
                    &quot;Edwin Montagu teeth.&quot; The surviving letters are revealing, but not in the
                    tabloid way that query suggests. In the material used on this site, the more
                    important evidence is the way Montagu&apos;s critics fused his looks, his nerves,
                    and his Jewishness into a single language of contempt.
                  </p>
                  <p>
                    Asquith could be cruel in private. In August 1912 he jokingly called Montagu
                    &quot;the Assyrian&quot; and asked Venetia whether the &quot;sheen of his spear&quot; had dazzled
                    her vision. Once the engagement became real, that rhetoric hardened into
                    something uglier. Writing on 12 May 1915, Asquith insists the problem is not
                    only the &quot;physical side,&quot; but then immediately slides into race-and-religion
                    language that makes the bias obvious.
                  </p>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                  <figure className="rounded-sm border border-border-beige/60 bg-white/75 p-4 shadow-sm">
                    <img
                      src="/edwin-montagu/Edwin_Samuel_Montagu.jpg"
                      alt="Studio portrait of Edwin Samuel Montagu"
                      className="block w-full rounded-sm sepia-[0.22] contrast-105 grayscale-[0.1]"
                    />
                    <figcaption className="mt-3 text-sm italic leading-relaxed text-stone-500">
                      Searchers may arrive looking for a physical description, but the archive tells
                      us more about Edwardian prejudice than about any single facial feature.
                    </figcaption>
                  </figure>

                  <div className="grid gap-5">
                    <QuoteCard date="14 August 1912" author="H.H. Asquith to Venetia Stanley">
                      <p>
                        &quot;I know ... that the Assyrian has been coming down among you like a wolf on
                        the fold. Did the &apos;sheen of his spear&apos; dazzle your vision?&quot;
                      </p>
                    </QuoteCard>

                    <QuoteCard date="12 May 1915" author="H.H. Asquith to Sylvia Henley">
                      <p>
                        &quot;It is not merely the prohibitive physical side (bad as that is) - I
                        won&apos;t say anything about race &amp; religion, tho&apos; they are not quite
                        negligible factors.&quot;
                      </p>
                      <p className="mt-3">
                        &quot;But he is not a man: a bundle of moods &amp; nerves &amp; symptoms.&quot;
                      </p>
                    </QuoteCard>
                  </div>
                </div>

                <p className="mt-6 text-base leading-relaxed text-navy/85">
                  So the rigorous answer to the appearance question is this: yes, contemporaries
                  mocked Montagu&apos;s looks, and some search traffic now reduces that to &quot;teeth.&quot;
                  But the archive&apos;s real value lies in showing how upper-class private speech could
                  turn physiognomy into a vehicle for social snobbery and casual antisemitism.
                </p>
              </section>

              <section id="conversion" className="scroll-mt-20">
                <h2 className="text-[1.8rem] font-serif font-semibold leading-tight text-accent-brown md:text-[2rem]">
                  Venetia&apos;s Conversion to Judaism
                </h2>
                <div className="mt-5 space-y-4 text-base leading-relaxed text-navy/85">
                  <p>
                    The conversion was a major threshold in the story, but not because Venetia
                    discovered a new devotional life. Montagu&apos;s father&apos;s settlement effectively
                    required a Jewish marriage. Montagu therefore argued for conversion in civic and
                    family terms, not mystical ones. On 30 April he tells Venetia that becoming a
                    Jewess should be like a woman becoming French by marrying a Frenchman.
                  </p>
                  <p>
                    Venetia&apos;s answer, written from Wimereux on 6 June, is one of the clearest
                    letters in the whole archive. She says outright that she is doing it because he
                    wants it and because, as she puts it with brutal candor, she thinks one is
                    &quot;happier rich than poor.&quot; She refuses to pretend that a formal change of label
                    has altered her race, nationality, or spiritual identity.
                  </p>
                </div>

                <div className="mt-8 grid gap-5 lg:grid-cols-3">
                  <QuoteCard date="30 April 1915" author="Edwin Montagu to Venetia Stanley">
                    <p>
                      &quot;I want you to become a Jewess just as a woman who marries a Frenchman
                      becomes a Frenchwoman.&quot;
                    </p>
                    <p className="mt-3">
                      &quot;I never think of myself as one. It&apos;s a thought which does not intrude.&quot;
                    </p>
                  </QuoteCard>

                  <QuoteCard date="6 June 1915" author="Venetia Stanley to Edwin Montagu">
                    <p>
                      &quot;Were I to be washed a 1000 times in the water of Jordan ... I should not
                      feel I had changed my race or nationality.&quot;
                    </p>
                    <p className="mt-3">
                      &quot;I&apos;m going to be quite honest ... I think one is happier rich than poor.&quot;
                    </p>
                  </QuoteCard>

                  <QuoteCard date="1 and 21 July 1915" author="Venetia Stanley and Cynthia Asquith">
                    <p>
                      Venetia jokes about &quot;a little judicious cramming of old Josephs at the last
                      minute&quot; before her interview with Rabbi Morris Joseph.
                    </p>
                    <p className="mt-3">
                      Cynthia records the circle&apos;s tone as well, noting Asquith&apos;s coarse joke about
                      whether Venetia had to &quot;propose Judas Iscariot&apos;s health.&quot;
                    </p>
                  </QuoteCard>
                </div>

                <p className="mt-6 text-base leading-relaxed text-navy/85">
                  The social consequence was immediate. Asquith&apos;s 30 May letter to Sylvia Henley
                  calls the move &quot;repugnant &amp; even repulsive,&quot; denounces Judaism as a &quot;narrow
                  sterile, tribal creed,&quot; and ends by saying that the thought of this fate for
                  Venetia makes him sick. That is exactly why the conversion needs to be explained
                  historically: not as a romantic flourish, but as a collision between money,
                  marriage law, elite prejudice, and wartime emotion.
                </p>
              </section>

              <section id="wedding-day" className="scroll-mt-20">
                <h2 className="text-[1.8rem] font-serif font-semibold leading-tight text-accent-brown md:text-[2rem]">
                  The Wedding Day (26 July 1915)
                </h2>
                <div className="mt-5 space-y-4 text-base leading-relaxed text-navy/85">
                  <p>
                    By late July the machinery of marriage was moving quickly. On 11 July Venetia
                    tells Montagu that she has informed her father of the plan to marry on the 26th,
                    urges him to get the license, and notes that her fortune has been put into
                    settlement. Cynthia Asquith then records a wedding-dress fitting at Jays on
                    23 July, describing Venetia as &quot;in excellent form and very happy.&quot;
                  </p>
                  <p>
                    The strongest surviving wedding-day detail in this project is about mood rather
                    than guest list. Cynthia notes on 26 July that Bluetooth had been at the wedding
                    lunch and said that everyone was &quot;very calm.&quot; That calm sat beside obvious
                    emotional damage. Two days earlier Asquith had written that it was better not
                    to say goodbye in person because of the &quot;full meaning&quot; of her new departure.
                  </p>
                  <p>
                    The archive used here is better on atmosphere than on a complete seating chart,
                    so it is safer to say what it clearly shows: the marriage took place on 26 July
                    1915 with Jewish rites at Lord Swaythling&apos;s house; Asquith did not attend;
                    and the fallout radiated through the Asquith family for years afterward, even
                    though he later sent silver boxes as a gift.
                  </p>
                </div>

                <div className="mt-8 grid gap-5 lg:grid-cols-3">
                  <QuoteCard date="11 July 1915" author="Venetia Stanley to Edwin Montagu">
                    <p>
                      Venetia tells him she has &quot;told her father of their intention to marry on the
                      26th&quot; and urges Montagu to procure the license soon.
                    </p>
                  </QuoteCard>

                  <QuoteCard date="24 July 1915" author="H.H. Asquith to Venetia Stanley">
                    <p>
                      &quot;I thought it was better for both of us not to say good-bye to-day.&quot;
                    </p>
                    <p className="mt-3">
                      He writes as the wedding approaches &quot;within a measurable number of hours.&quot;
                    </p>
                  </QuoteCard>

                  <QuoteCard date="26 July 1915" author="Cynthia Asquith's diary">
                    <p>
                      Bluetooth had been to Venetia&apos;s wedding lunch and said &quot;all were very calm.&quot;
                    </p>
                  </QuoteCard>
                </div>
              </section>

              <section className="rounded-sm border border-border-beige/60 bg-white/70 p-6 md:p-8">
                <h2 className="text-[1.6rem] font-serif font-semibold leading-tight text-navy">
                  Related Reading
                </h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <RelatedLink
                    href="/chapter/venetia-stanley-engagement-1915"
                    label="Venetia's Engagement"
                    description="The project chapter on the spring and summer 1915 engagement crisis."
                  />
                  <RelatedLink
                    href="/chapter/venetia-stanley-jewish-conversion"
                    label="The Jewish Conversion"
                    description="A chapter-length version of the inheritance issue, conversion, and backlash."
                  />
                  <RelatedLink
                    href="/chapter/asquith-venetia-after-1915"
                    label="After the Breakup"
                    description="What happened to Asquith, Venetia, and the Montagus after the wedding in 1915."
                  />
                  <RelatedLink
                    href="/edwin-montagu-precipice"
                    label="Who Was Edwin Montagu?"
                    description="A wider historical guide to Montagu, his politics, and his portrayal in fiction."
                  />
                </div>
              </section>

              <section id="sources" className="border-t border-border-beige/60 pt-8">
                <h2 className="text-[1.6rem] font-serif font-semibold leading-tight text-navy">
                  Sources and Method
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-navy/80">
                  <p>
                    Quotations on this page come from the surviving letters of H.H. Asquith,
                    Venetia Stanley, Edwin Montagu, and Sylvia Henley, plus July 1915 diary entries
                    by Cynthia Asquith. The Montagu correspondence is drawn from the Trinity College
                    Cambridge archive, including Series MONT II.
                  </p>
                  <p>
                    Where the surviving material gives a precise phrase, this page quotes it. Where
                    the archive in hand is incomplete, especially on the exact guest list for the
                    wedding, the page avoids pretending to know more than the record shows.
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
