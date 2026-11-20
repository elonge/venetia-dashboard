import type { Metadata } from "next";
import Link from "next/link";
import { FAQ_ITEMS } from "./faq";
import { ArrowRight } from "lucide-react";

type BioTimelineTone = "cyan" | "orange" | "navy";

type BioTimelineEvent = {
  year: string;
  date: string;
  title: string;
  summary: string;
  mainText: string;
  italicText: string;
  evidenceImage?: string;
  imageAlt?: string;
  tone: BioTimelineTone;
};

const BIO_TIMELINE_EVENTS: BioTimelineEvent[] = [
  {
    year: "1837",
    date: "Dec 24, 1837",
    title: "Born in Munich",
    summary:
      "Elisabeth Amalie Eugenie is born on Christmas Eve into the Wittelsbach ducal line in Bavaria.",
    mainText:
      "Raised largely at Possenhofen Castle on Lake Starnberg by her eccentric father, Duke Maximilian Joseph, and her mother, Princess Ludovika, Elisabeth grows up riding horses, hiking in the mountains, and writing poetry—completely unprepared for rigid royal protocol.",
    italicText:
      "Because she was born on Christmas Eve with a baby tooth, family folklore predicted she was destined for an extraordinary—and fateful—life.",
    tone: "cyan",
  },
  {
    year: "1853",
    date: "Aug 18, 1853",
    title: "The Engagement at Bad Ischl",
    summary:
      "Intended as a bystander while her older sister Helene meets Emperor Franz Joseph, 15-year-old Elisabeth captures the Emperor's heart instead.",
    mainText:
      "Archduchess Sophie and Princess Ludovika had arranged for 23-year-old Franz Joseph to propose to 19-year-old Helene ('Néné'). Instead, Franz Joseph is captivated by Elisabeth's spontaneity and informs his mother he will marry Elisabeth or no one at all.",
    italicText:
      "Years later, Elisabeth lamented: 'One is sold as a fifteen-year-old child and makes a vow one does not understand and then rues for thirty years or more.'",
    tone: "navy",
  },
  {
    year: "1854",
    date: "April 24, 1854",
    title: "Empress of Austria",
    summary:
      "At age 16, Elisabeth marries Franz Joseph in Vienna's Augustinerkirche and enters the unforgiving Spanish etiquette of the Hofburg.",
    mainText:
      "Overwhelmed by public ceremonies, suffocating court rules, and constant criticism from Archduchess Sophie, Elisabeth quickly develops insomnia, coughing fits, and acute anxiety—while Franz Joseph remains absorbed in governing his empire.",
    italicText:
      "Within days of her wedding, Elisabeth began expressing her isolation in private poems mourning her lost Bavarian freedom.",
    tone: "orange",
  },
  {
    year: "1855",
    date: "1855 – 1857",
    title: "Loss of the Nursery & Death of Little Sophie",
    summary:
      "Archduchess Sophie seizes control of Elisabeth's first two daughters, and tragedy strikes during an 1857 journey to Hungary.",
    mainText:
      "Declaring Elisabeth too young to raise royal children, Archduchess Sophie installs baby Sophie (born 1855) and Gisela (born 1856) in apartments beside her own. In May 1857, after Elisabeth insists on bringing both girls on a state visit to Hungary, two-year-old Sophie contracts typhus or dysentery in Buda and dies in Elisabeth's arms.",
    italicText:
      "Elisabeth never forgave herself for her firstborn's death and fell into her first severe depressive collapse.",
    tone: "orange",
  },
  {
    year: "1858",
    date: "Aug 21, 1858",
    title: "Birth of Crown Prince Rudolf",
    summary:
      "Elisabeth gives birth to the long-awaited male heir to the Habsburg throne at Laxenburg Palace.",
    mainText:
      "Exhausted by a difficult labor, Elisabeth is again sidelined as Archduchess Sophie takes charge of the heir's nursery and hands the sensitive boy over to harsh military tutors.",
    italicText:
      "Though the birth of a male heir temporarily boosted Elisabeth's standing at court, her personal isolation deepened.",
    tone: "navy",
  },
  {
    year: "1860",
    date: "Nov 1860 – 1862",
    title: "Flight to Madeira and Corfu",
    summary:
      "Diagnosed with severe lung and nervous exhaustion, Elisabeth leaves Vienna and her children for nearly two years.",
    mainText:
      "Sailing first to the Portuguese island of Madeira for six months and then to Corfu, Elisabeth discovers that physical distance from Vienna restores her health—and gives her leverage over Franz Joseph, who writes pleading letters begging her to return.",
    italicText:
      "Her prolonged absence shocked European courts, marking the moment Elisabeth began dictating her own terms to the Hofburg.",
    tone: "cyan",
  },
  {
    year: "1864",
    date: "1864 – 1865",
    title: "Ida Ferenczy & The Household Ultimatum",
    summary:
      "Elisabeth appoints Hungarian noblewoman Ida Ferenczy as her confidante and forces Franz Joseph to end Archduchess Sophie's control over their children.",
    mainText:
      "Bypassing aristocratic gatekeepers, Elisabeth hires Ida Ferenczy to teach her Hungarian and serve as her private secretary. In August 1865, Elisabeth issues an ultimatum to Franz Joseph: either she is granted full authority over Crown Prince Rudolf's education and her own household, or she will leave him permanently.",
    italicText:
      "Franz Joseph capitulated completely, replacing Rudolf's harsh military governor with the liberal tutor Joseph Latour.",
    evidenceImage: "/sisi/Kaiserin_Elisabeth_im_Morgenlicht.jpg",
    imageAlt: "Franz Xaver Winterhalter's intimate 1864 portrait of Empress Elisabeth with her hair unbound",
    tone: "cyan",
  },
  {
    year: "1867",
    date: "June 8, 1867",
    title: "Crowned Queen of Hungary",
    summary:
      "Following Austria's 1866 defeat by Prussia, Elisabeth helps broker the Austro-Hungarian Compromise and is crowned in Buda.",
    mainText:
      "Using Ida Ferenczy as a covert intermediary with Hungarian statesmen Count Gyula Andrássy and Ferenc Deák, Elisabeth relentlessly lobbies Franz Joseph to grant Hungary constitutional autonomy. On June 8, 1867, Count Andrássy places the Crown of Saint Stephen on Franz Joseph's head, creating the Dual Monarchy of Austria-Hungary.",
    italicText:
      "Eleven days after the coronation celebration, Franz Joseph's brother Maximilian was executed by firing squad in Mexico.",
    evidenceImage: "/sisi/elisabeth-1867.jpg",
    imageAlt: "Portrait of Empress Elisabeth wearing the Hungarian coronation gown and diamond crown in 1867",
    tone: "navy",
  },
  {
    year: "1868",
    date: "April 22, 1868",
    title: "Birth of 'The Hungarian Child'",
    summary:
      "Elisabeth gives birth in Buda to her fourth child, Archduchess Marie Valerie—the only child she is permitted to raise herself.",
    mainText:
      "Deliberately choosing to give birth in Hungary rather than Vienna, Elisabeth raises Marie Valerie in Hungarian and calls her 'the Only One.' Anti-Hungarian courtiers spread false rumors that Count Andrássy was the child's father, gossip historians reject.",
    italicText:
      "Having broken Sophie's power and reconciled Hungary, Elisabeth stepped permanently away from active politics after 1868.",
    tone: "cyan",
  },
  {
    year: "1869",
    date: "1869 – 1882",
    title: "Cult of Beauty & English Hunting Seasons",
    summary:
      "Refusing all portraits after age 32, Elisabeth pursues extreme fitness regimes and becomes a daring fox-hunter in Britain and Ireland.",
    mainText:
      "Obsessed with maintaining a 19-inch waist and ankle-length chestnut hair, Elisabeth adheres to starvation diets and daily gymnastics. Between 1876 and 1882, escorted by Scottish cavalry captain Bay Middleton, she spends winters riding aggressively across Leicestershire and County Meath.",
    italicText:
      "After age 32, determined to remain eternally young in public memory, she hid behind leather fans and parasols whenever cameras appeared.",
    evidenceImage: "/sisi/Elisabeth_of_Austria,_by_Franz_Xaver_Winterhalter.jpg",
    imageAlt: "Franz Xaver Winterhalter's famous 1865 gala portrait of Empress Elisabeth with diamond stars in her hair",
    tone: "orange",
  },
  {
    year: "1886",
    date: "1886",
    title: "Orchestrating Franz Joseph's Bond with Katharina Schratt",
    summary:
      "To ease her guilt over her constant absences from Vienna, Elisabeth arranges Burgtheater actress Katharina Schratt's companionship for the Emperor.",
    mainText:
      "Using Ida Ferenczy as go-between, Elisabeth encourages a warm, discreet friendship between Franz Joseph and Schratt—whom Elisabeth affectionately calls 'the Friend' in letters—ensuring the aging Emperor has domestic comfort while Elisabeth travels.",
    italicText:
      "Surviving letters show Elisabeth personally thanking Schratt for looking after Franz Joseph.",
    tone: "navy",
  },
  {
    year: "1889",
    date: "Jan 30, 1889",
    title: "The Mayerling Tragedy",
    summary:
      "Elisabeth's only son, 30-year-old Crown Prince Rudolf, dies in a murder-suicide pact with 17-year-old Baroness Mary Vetsera at Mayerling.",
    mainText:
      "Elisabeth is the first to learn of Rudolf's death and breaks the news to Franz Joseph in Vienna. Shattered beyond recovery, she gives away her jewelry and colored dresses and wears exclusively black mourning attire for the rest of her life.",
    italicText:
      "Around this time she sealed her private anti-monarchist poems in the Swiss Federal Archives with instructions that they remain closed for 60 years after her death.",
    evidenceImage: "/sisi/Mayerling_1889.jpg",
    imageAlt: "The imperial hunting lodge at Mayerling prior to its conversion into a Carmelite convent after 1889",
    tone: "orange",
  },
  {
    year: "1890",
    date: "1890 – 1897",
    title: "The Achilleion & Restless Exile",
    summary:
      "Signing letters as 'The Seagull,' Elisabeth builds a Greek palace on Corfu and wanders ceaselessly across Europe and the Mediterranean.",
    mainText:
      "Dedicated to Homer's Achilles, her neoclassical villa on Corfu briefly offers solace, but restlessness soon drives her back onto steam yachts and private trains through Switzerland, France, Spain, North Africa, and Hungary.",
    italicText:
      "During Mediterranean storms, she insisted on being tied to the mast of her yacht, writing that proximity to death was when she felt most alive.",
    tone: "cyan",
  },
  {
    year: "1898",
    date: "Sept 10, 1898",
    title: "Assassination in Geneva",
    summary:
      "Traveling incognito without police protection, 60-year-old Elisabeth is fatally stabbed along Lake Geneva by Italian anarchist Luigi Lucheni.",
    mainText:
      "Walking from the Hôtel Beau-Rivage to catch a steamship to Montreux with a single companion, Countess Irma Sztáray, Elisabeth is stabbed in the heart with a sharpened triangular file. Compressed by her tight corset, the wound goes unnoticed until she collapses aboard the steamer Genève.",
    italicText:
      "One of the last candid photographs ever taken of Empress Elisabeth, walking incognito in Geneva with Countess Irma Sztáray in September 1898.",
    evidenceImage: "/sisi/elisabeth-last-photo.jpg",
    imageAlt: "Candid photograph of Empress Elisabeth and Countess Irma Sztáray walking in Geneva in September 1898",
    tone: "navy",
  },
  {
    year: "1898",
    date: "Sept 17, 1898",
    title: "State Funeral in Vienna",
    summary:
      "Elisabeth's body is returned to Vienna by special mourning train and laid to rest in the Imperial Crypt beneath the Capuchin Church.",
    mainText:
      "Despite Elisabeth's lifelong hatred of Habsburg court ceremonial and her wish to be buried quietly near the sea in Corfu, Franz Joseph ordered a full imperial state funeral in Vienna, attended by crowds lining the Ringstrasse and Augustinerstrasse.",
    italicText:
      "Elisabeth was interred in the Capuchin Crypt beside her son Crown Prince Rudolf, where Franz Joseph joined them eighteen years later in 1916.",
    evidenceImage: "/sisi/elisabeth-funeral.jpg",
    imageAlt: "Empress Elisabeth's imperial funeral procession passing through central Vienna in September 1898",
    tone: "orange",
  },
];

const TIMELINE_TONE_STYLES: Record<
  BioTimelineTone,
  {
    markerBorder: string;
    markerText: string;
    connector: string;
    cardBorder: string;
    panelBorder: string;
    badge: string;
  }
> = {
  cyan: {
    markerBorder: "border-[#4D7A82]",
    markerText: "text-[#355E65]",
    connector: "bg-[#4D7A82]",
    cardBorder: "border-[#4D7A82]/45",
    panelBorder: "border-[#4D7A82]/60",
    badge: "text-[#355E65]",
  },
  orange: {
    markerBorder: "border-[#A66C46]",
    markerText: "text-[#8C5533]",
    connector: "bg-[#A66C46]",
    cardBorder: "border-[#A66C46]/45",
    panelBorder: "border-[#A66C46]/60",
    badge: "text-[#8C5533]",
  },
  navy: {
    markerBorder: "border-[#4C5F78]",
    markerText: "text-[#354B66]",
    connector: "bg-[#4C5F78]",
    cardBorder: "border-[#4C5F78]/45",
    panelBorder: "border-[#4C5F78]/60",
    badge: "text-[#354B66]",
  },
};

export const metadata: Metadata = {
  title: {
    absolute: "Empress Elisabeth of Austria (Sisi): Biography & Timeline (1837–1898)",
  },
  description:
    "Explore the chronological biography of Empress Elisabeth (Sisi). Trace her Bavarian childhood, marriage to Franz Joseph, Hungarian coronation, Mayerling tragedy, and assassination in Geneva.",
  alternates: {
    canonical: "/sisi/timeline",
  },
  openGraph: {
    title: "Empress Elisabeth of Austria (Sisi): Biography & Timeline (1837–1898)",
    description:
      "Explore the chronological biography of Empress Elisabeth (Sisi). Trace her Bavarian childhood, marriage to Franz Joseph, Hungarian coronation, Mayerling tragedy, and assassination in Geneva.",
    url: "/sisi/timeline",
    type: "article",
    images: [
      {
        url: "/sisi/Elisabeth_of_Austria,_by_Franz_Xaver_Winterhalter.jpg",
        width: 1200,
        height: 630,
        alt: "Portrait of Empress Elisabeth of Austria by Franz Xaver Winterhalter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Empress Elisabeth of Austria (Sisi): Biography & Timeline (1837–1898)",
    description:
      "Explore the chronological biography of Empress Elisabeth (Sisi). Trace her Bavarian childhood, marriage to Franz Joseph, Hungarian coronation, Mayerling tragedy, and assassination in Geneva.",
    images: ["/sisi/Elisabeth_of_Austria,_by_Franz_Xaver_Winterhalter.jpg"],
  },
};

export default function SisiTimelinePage() {
  const heroImage = "/sisi/Elisabeth_of_Austria,_by_Franz_Xaver_Winterhalter.jpg";

  return (
    <div className="min-h-screen bg-page-bg text-ink">
      <section className="relative overflow-hidden border-b border-border-beige/70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(166,108,70,0.14),transparent_54%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(77,122,130,0.14),transparent_52%)]" />

        <div className="relative mx-auto max-w-[1500px] px-6 pt-12 md:pt-16">
          <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(460px,42vw)]">
            <div className="flex h-full flex-col justify-center gap-6 pb-10 md:pb-14">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-accent-brown">
                  Historical Profile • Case Study
                </p>
                <h1 className="mt-4 text-4xl font-bold leading-tight text-navy md:text-6xl">
                  Empress Elisabeth (Sisi)
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate md:text-lg">
                  Bavarian duchess, reluctant Empress of Austria, and Queen of Hungary. This page maps the documented milestones, private letters, and personal tragedies behind the romantic &ldquo;Sisi&rdquo; myth.
                </p>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-gray">
                  Empress of Austria (1854–1898)
                  <span className="px-2 text-accent-brown">&middot;</span>
                  Queen of Hungary (1867–1898)
                </p>
              </div>

              <div className="max-w-xl rounded-sm border-l-2 border-accent-brown bg-stone-100/90 p-4 text-sm text-navy/85">
                <span className="font-bold text-navy">Why is this on The Venetia Project?</span>{" "}
                Like Venetia Stanley, Elisabeth is known largely through other people&apos;s words—she destroyed almost all her letters to Franz Joseph, leaving surviving letters to confidantes and sealed poems to correct the fairy-tale legend.{" "}
                <Link
                  href="/sisi/the-empress-fact-vs-fiction"
                  className="font-semibold text-accent-brown underline underline-offset-4 hover:text-navy"
                >
                  Fact-check Netflix&apos;s The Empress →
                </Link>
              </div>
            </div>

            <div className="relative w-full md:mr-[-9vw] lg:mr-[-11vw]">
              <img
                src={heroImage}
                alt="Portrait of Empress Elisabeth of Austria by Franz Xaver Winterhalter"
                className="h-[390px] w-full object-cover object-top md:h-[620px]"
                loading="eager"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-page-bg to-transparent md:w-44" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-accent-brown">
            Biography
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-navy md:text-3xl">
            The Life of Empress Elisabeth (1837–1898)
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate md:text-base">
            A vertical dossier of the turning points that transformed a 16-year-old Bavarian bride into Europe&apos;s most restless and misunderstood monarch.
          </p>
        </div>

        <div className="relative mt-10">
          <div className="absolute bottom-0 left-6 top-0 w-px bg-border-beige md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-8 md:space-y-10">
            {BIO_TIMELINE_EVENTS.map((event, index) => {
              const tone = TIMELINE_TONE_STYLES[event.tone];
              const isLeft = index % 2 === 0;

              return (
                <article key={`${event.year}-${event.title}`} className="relative">
                  <div
                    className={`absolute left-6 top-7 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 bg-card-bg text-[10px] font-bold shadow-[0_8px_20px_rgba(20,20,20,0.12)] md:left-1/2 ${tone.markerBorder} ${tone.markerText}`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className={`absolute left-6 top-[44px] h-[2px] w-6 ${tone.connector} md:hidden`} />
                  <div
                    className={`absolute top-[44px] hidden h-[2px] md:block ${tone.connector} ${
                      isLeft ? "right-1/2 w-16" : "left-1/2 w-16"
                    }`}
                  />

                  <div className="grid md:grid-cols-2">
                    <div
                      className={`${
                        isLeft ? "md:pr-16" : "md:col-start-2 md:pl-16"
                      } pl-12 pt-3 md:pl-0`}
                    >
                      <details
                        className={`group/case rounded-2xl border bg-card-bg/95 p-4 shadow-[0_12px_24px_rgba(26,42,64,0.08)] ${tone.cardBorder}`}
                        open={index === 0 || Boolean(event.evidenceImage)}
                        data-track-component="sisi_timeline_item"
                        data-track-section="sisi-timeline"
                        data-track-item={`${event.year}-${event.title}`}
                      >
                        <summary className="cursor-pointer list-none">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-accent-brown">
                            {event.date}
                          </p>
                          <h3 className="mt-1 text-base font-semibold leading-tight text-navy">
                            {event.title}
                          </h3>
                          <p className="mt-3 text-sm leading-relaxed text-slate">
                            {event.summary}
                          </p>
                          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-gray">
                            <span className="group-open/case:hidden">Read more ↓</span>
                            <span className="hidden group-open/case:inline">Read less ↑</span>
                          </p>
                        </summary>

                        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-open/case:grid-rows-[1fr]">
                          <div className="overflow-hidden">
                            <div className="mt-4 border-t border-border-beige pt-4">
                              {event.evidenceImage && (
                                <div className="mt-3 mb-4 aspect-[4/3] overflow-hidden border border-border-beige bg-page-bg">
                                  <img
                                    src={event.evidenceImage}
                                    alt={event.imageAlt || event.title}
                                    className="h-full w-full object-cover object-top"
                                    loading="lazy"
                                  />
                                </div>
                              )}
                              <p className="text-sm leading-relaxed text-slate">
                                {event.mainText}
                              </p>
                              <div className="mt-5 border-t border-ink/10 pt-4">
                                <blockquote className="border-l-2 border-border-beige pl-3 text-xs italic leading-relaxed text-muted-gray">
                                  {event.italicText}
                                </blockquote>
                              </div>
                            </div>
                          </div>
                        </div>
                      </details>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14 md:pb-16">
        <div className="md:pr-8">
          <h2 className="text-2xl font-semibold text-navy md:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 divide-y divide-border-beige">
            {FAQ_ITEMS.map((item, index) => (
              <details
                key={item.question}
                className="group py-4"
                open={index === 0}
                data-track-component="sisi_faq_item"
                data-track-section="sisi-faq"
                data-track-item={item.question}
              >
                <summary className="cursor-pointer list-none pr-8 text-lg font-semibold text-navy marker:content-none">
                  {item.question}
                </summary>
                <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate md:text-base">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-12 grid gap-4 border-t border-border-beige pt-8 md:grid-cols-2">
            <Link
              href="/sisi/the-empress-fact-vs-fiction"
              className="group flex items-center justify-between rounded-sm border border-border-beige bg-card-bg p-5 transition-colors hover:border-accent-green/40"
            >
              <div>
                <p className="font-serif text-lg font-semibold text-navy">
                  The Empress Season 3: Fact vs. Fiction
                </p>
                <p className="mt-1 text-xs text-slate">
                  Checking Andrássy, Terese, and the 1867 coronation against primary archives.
                </p>
              </div>
              <ArrowRight
                size={16}
                className="shrink-0 text-accent-brown transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/sisi/after-1867"
              className="group flex items-center justify-between rounded-sm border border-border-beige bg-card-bg p-5 transition-colors hover:border-accent-green/40"
            >
              <div>
                <p className="font-serif text-lg font-semibold text-navy">
                  What Happened to Sisi After 1867?
                </p>
                <p className="mt-1 text-xs text-slate">
                  Deep dive into Marie Valerie, Katharina Schratt, Mayerling, and Geneva.
                </p>
              </div>
              <ArrowRight
                size={16}
                className="shrink-0 text-accent-brown transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}