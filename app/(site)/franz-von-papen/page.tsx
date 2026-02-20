import type { Metadata } from "next";
import { FAQ_ITEMS } from "./faq";

type BioTimelineTone = "cyan" | "orange" | "navy";

type BioTimelineEvent = {
  year: string;
  date: string;
  title: string;
  summary: string;
  mainText: string;
  italicText: string;
  thumbnailImage: string;
  evidenceImage: string;
  imageAlt: string;
  tone: BioTimelineTone;
};

const BIO_TIMELINE_EVENTS: BioTimelineEvent[] = [
  {
    year: "1879",
    date: "Oct 29, 1879",
    title: "Born in Werl",
    summary: "Papen was born into an aristocratic Roman Catholic family in Westphalia.",
    mainText: "Guided into a military career by his father, he learned the military discipline, bearing, and loyalty to the monarchy that shaped his political future.",
    italicText: "Papen consistently framed his role as a duty to preserve the conservative order.",
    thumbnailImage: "/papen_photos/papen_young.jpg",
    evidenceImage: "/papen_photos/papen_young.jpg",
    imageAlt: "Portrait of a young Franz von Papen in military uniform",
    tone: "cyan",
  },
  {
    year: "1913",
    date: "1913 - 1915",
    title: "Washington Attaché",
    summary: "He served as the German military attaché in the United States until his expulsion.",
    mainText: "The posting gave Papen access to diplomatic circles, but he was expelled in 1915 for directing anti-Allied espionage and sabotage operations.",
    italicText: "Check stubs documenting agent payoffs were confiscated from his luggage, causing public embarrassment.",
    thumbnailImage: "/papen_photos/major_Franz_von_Papen_1917.jpg",
    evidenceImage: "/papen_photos/major_Franz_von_Papen_1917.jpg",
    imageAlt: "Franz von Papen in formal military uniform with Pickelhaube",
    tone: "navy",
  },
  {
    year: "1921",
    date: "1921",
    title: "Entering Politics",
    summary: "Papen traded the life of a country gentleman for a seat in the Prussian state diet.",
    mainText: "Representing the Catholic Center party, he advocated for agricultural interests but held narrow, extreme views that rejected parliamentary democracy.",
    italicText: "He believed true political leadership had to come from an experienced, authoritarian ruling elite.",
    thumbnailImage: "/papen_photos/vonpapen-young.jpg",
    evidenceImage: "/papen_photos/vonpapen-young.jpg",
    imageAlt: "Papen in a suit and tie, looking stern and formal",
    tone: "orange",
  },
  {
    year: "1932",
    date: "June 1, 1932",
    title: "Chancellor of Germany",
    summary: "President Hindenburg appointed the little-known Papen to form a national government.",
    mainText: "Papen formed the 'Cabinet of Barons,' composed largely of nobility, which bypassed the Reichstag and governed using presidential emergency decrees.",
    italicText: "General Kurt von Schleicher orchestrated the appointment, intending to use Papen as a figurehead.",
    thumbnailImage: "/papen_photos/Papen_cabinet_1932.jpg",
    evidenceImage: "/papen_photos/Papen_cabinet_1932.jpg",
    imageAlt: "Franz von Papen posing with his cabinet members in 1932",
    tone: "cyan",
  },
  {
    year: "1932",
    date: "July 20, 1932",
    title: "The Prussian Coup",
    summary: "Papen ousted the elected Social Democratic government of Prussia, Germany's largest state.",
    mainText: "Using the pretext of restoring public order after street riots, Papen invoked an emergency decree to depose the state government and name himself Reich Commissioner.",
    italicText: "A German street column in 1932 displaying a presidential emergency decree by Paul von Hindenburg alongside Nazi election posters.",
    thumbnailImage: "/papen_photos/csm_Preussenschlag_1440x617_5e1f5968e1.jpg",
    evidenceImage: "/papen_photos/csm_Preussenschlag_1440x617_5e1f5968e1.jpg",
    imageAlt: "A German street column in 1932 displaying a presidential emergency decree by Paul von Hindenburg alongside Nazi election posters.",
    tone: "orange",
  },
  {
    year: "1933",
    date: "Jan 30, 1933",
    title: "Hitler's Vice-Chancellor",
    summary: "Papen masterminded the appointment of Adolf Hitler as Chancellor of Germany.",
    mainText: "Determined to regain power after losing the Chancellorship, Papen negotiated a coalition making himself Vice-Chancellor, believing his conservative allies could control Hitler.",
    italicText: "Papen famously predicted: 'In two months we’ll have pushed Hitler into a corner so hard he’ll be squeaking'.",
    thumbnailImage: "/papen_photos/papen-hitler-hugenburg-1933.jpg",
    evidenceImage: "/papen_photos/papen-hitler-hugenburg-1933.jpg",
    imageAlt: "Franz von Papen, Hugenburg, and Adolf Hitler side-by-side",
    tone: "navy",
  },
  {
    year: "1934",
    date: "June 17, 1934",
    title: "The Marburg Speech",
    summary: "Papen delivered a public address calling for an end to the Nazi reign of terror.",
    mainText: "Drafted by his advisors, the speech warned against a 'second revolution' and criticized those mistaking brutality for vitality.",
    italicText: "The speech infuriated Hitler; weeks later, Papen's close associates were murdered during the Night of the Long Knives.",
    thumbnailImage: "/papen_photos/1933-10-25 - Franz von Papen - Rundfunkrede des Vizekanzlers zur Volksabstimmung am 12. November.jpg",
    evidenceImage: "/papen_photos/1933-10-25 - Franz von Papen - Rundfunkrede des Vizekanzlers zur Volksabstimmung am 12. November.jpg",
    imageAlt: "Franz von Papen delivering a radio address at a podium",
    tone: "navy",
  },
  {
    year: "1934",
    date: "July 26, 1934",
    title: "Minister to Austria",
    summary: "Following the assassination of Austria's Chancellor, Papen was appointed Minister to Vienna.",
    mainText: "Despite the murder of his own staff, Papen accepted the post and worked to undermine the Austrian government and strengthen local National Socialists.",
    italicText: "His years of diplomatic intrigue and bullying paved the way for the 1938 annexation of Austria (Anschluss).",
    thumbnailImage: "/papen_photos/Papen_Vienna_1934.jpg",
    evidenceImage: "/papen_photos/Papen_Vienna_1934.jpg",
    imageAlt: "Franz von Papen and his wife before flying to Austria",
    tone: "orange",
  },
  {
    year: "1939",
    date: "April 29, 1939",
    title: "Ambassador to Turkey",
    summary: "Papen was appointed Ambassador to Turkey, a position he held throughout most of WWII.",
    mainText: "In Ankara, he eagerly resumed espionage activities, providing Germany with vital intelligence while attempting to persuade Turkey to join the Axis alliance.",
    italicText: "He returned to Germany only when Turkey broke off diplomatic relations in August 1944.",
    thumbnailImage: "/papen_photos/papen_1940.jpg",
    evidenceImage: "/papen_photos/papen_1940.jpg",
    imageAlt: "Franz von Papen in a gray coat and hat during his diplomatic years",
    tone: "cyan",
  },
  {
    year: "1945",
    date: "Oct 18, 1945",
    title: "The Nuremberg Trials",
    summary: "Papen was indicted by the International Military Tribunal on charges of crimes against peace.",
    mainText: "The Tribunal found that while he used 'intrigue and bullying' in Austria, his actions were offenses against political morality rather than legally definable war crimes, leading to his acquittal.",
    italicText: "He later spent time in a denazification labor camp before dedicating his final years to writing his memoirs.",
    thumbnailImage: "/papen_photos/papen_nuremberg.jpg",
    evidenceImage: "/papen_photos/papen_nuremberg.jpg",
    imageAlt: "Franz von Papen at the Nuremberg Trials",
    tone: "navy",
  }
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
    absolute: "Franz von Papen: Chancellor, Hitler's Vice-Chancellor & Timeline",
  },
  description:
    "Explore the chronological biography of Franz von Papen. Trace the career of the conservative German politician who engineered Adolf Hitler's rise to power",
  alternates: {
    canonical: "/franz-von-papen",
  },
  openGraph: {
    title: "Franz von Papen: Chancellor, Hitler's Vice-Chancellor & Timeline",
    description:
      "Explore the chronological biography of Franz von Papen. Trace the career of the conservative German politician who engineered Adolf Hitler's rise to power",
    url: "/franz-von-papen",
    type: "article",
    images: [
      {
        url: "/papen_photos/papen_1932.jpg",
        width: 1200,
        height: 630,
        alt: "Franz von Papen archival portrait",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Franz von Papen: Chancellor, Hitler's Vice-Chancellor & Timeline",
    description:
      "Explore the chronological biography of Franz von Papen. Trace the career of the conservative German politician who engineered Adolf Hitler's rise to power",
    images: ["/papen_photos/papen_1932.jpg"],
  },
};

export default function FranzVonPapenPage() {
  const heroImage = "https://commons.wikimedia.org/wiki/Special:FilePath/Franz_von_Papen.jpg";

  return (
    <div className="min-h-screen bg-page-bg text-ink">
      <section className="relative overflow-hidden border-b border-border-beige/70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(166,108,70,0.14),transparent_54%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(77,122,130,0.14),transparent_52%)]" />

        <div className="relative mx-auto max-w-[1500px] px-6 pt-12 md:pt-16">
          <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(460px,42vw)]">
            <div className="flex h-full flex-col justify-center gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-accent-brown">
                Historical Profile
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-navy md:text-6xl">
                Franz von Papen
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate md:text-lg">
                German politician, diplomat, and former chancellor. This page
                maps the key moments, miscalculations, and political maneuvers
                that made him a central figure in Weimar&apos;s collapse.
              </p>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-gray">
                Chancellor (1932)
                <span className="px-2 text-accent-brown">&middot;</span>
                Vice Chancellor (1933-1934)
              </p>
            </div>
            <div className="mt-8 max-w-xl">
              <h3 className="text-[16px] font-semibold uppercase tracking-[0.32em] text-slate">
                Companion Podcast
              </h3>
              <p className="mt-2 mb-3 text-base italic leading-relaxed text-slate/90">
                Listen to the complete four-part series while you explore the timeline.
              </p>
              <div className="overflow-hidden border border-border-beige/70 bg-card-bg rounded-2xl">
                <iframe
                  src="https://open.spotify.com/embed/playlist/1Gq4lfQjuD0AC94PV4HSD7?utm_source=generator&theme=0"
                  width="100%"
                  height="152"
                  allowFullScreen={false}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
            <div className="relative w-full md:mr-[-9vw] lg:mr-[-11vw]">
              <img
                src={heroImage}
                alt="Portrait of Franz von Papen"
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
            The Life of Franz von Papen
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate md:text-base">
            A vertical dossier of the career milestones that connected elite
            conservatism, emergency rule, and authoritarian takeover.
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
                    className={`absolute top-[44px] hidden h-[2px] md:block ${tone.connector} ${isLeft ? "right-1/2 w-16" : "left-1/2 w-16"}`}
                  />

                  <div className="grid md:grid-cols-2">
                    <div
                      className={`${isLeft ? "md:pr-16" : "md:col-start-2 md:pl-16"} pl-12 pt-3 md:pl-0`}
                    >
                      <details
                        className={`group/case rounded-2xl border bg-card-bg/95 p-4 shadow-[0_12px_24px_rgba(26,42,64,0.08)] ${tone.cardBorder}`}
                        open={index === 0}
                        data-track-component="franz_timeline_item"
                        data-track-section="franz-von-papen-timeline"
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
                              <div className="mt-3 mb-4 aspect-[4/3] overflow-hidden border border-border-beige bg-page-bg">
                                <img
                                  src={event.evidenceImage}
                                  alt={event.imageAlt}
                                  className="h-full w-full object-cover object-top grayscale contrast-110 sepia-[0.25]"
                                  loading="lazy"
                                />
                              </div>
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
                data-track-component="franz_faq_item"
                data-track-section="franz-von-papen-faq"
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

          {/* <aside className="space-y-5">
            <div className="rounded-3xl border border-border-beige bg-card-bg/95 p-6 shadow-[0_20px_38px_rgba(26,42,64,0.08)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-accent-brown">
                Podcast
              </p>
              <h2 className="mt-2 text-xl font-semibold text-navy">
                Deep Dive Episodes
              </h2>
              <ol className="mt-5 space-y-3">
                {deepDiveEpisodes.map((episode, index) => (
                  <li key={episode.title}>
                    <a
                      href={episode.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-2xl border border-border-beige bg-page-bg/85 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(20,20,20,0.1)]"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-border-beige bg-card-bg px-1 text-[10px] font-semibold text-muted-gray">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <p className="text-sm font-semibold leading-tight text-navy">
                            {episode.title}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-slate">
                            {episode.description}
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-border-beige bg-section-bg/85 px-5 py-4">
              <p className="text-sm text-slate">
                Prefer the written version? Read the companion analysis on{" "}
                <a
                  href={substackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-accent-green underline decoration-accent-green/35 underline-offset-4 transition-colors hover:text-navy"
                >
                  Substack
                </a>
                .
              </p>
            </div>
          </aside> */}
        </div>
      </section>
    </div>
  );
}
