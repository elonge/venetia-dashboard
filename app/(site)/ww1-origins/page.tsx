import Image from "next/image";

const dominoes = [
  {
    title: "A Spark in Sarajevo",
    detail:
      "On June 28, 1914, Archduke Franz Ferdinand was assassinated. A localized crisis suddenly demanded a response.",
  },
  {
    title: "The Ultimatum",
    detail:
      "Austria-Hungary issued a harsh ultimatum to Serbia, designed to be accepted only in part and justify action.",
  },
  {
    title: "Alliance Wiring",
    detail:
      "Russia pledged support to Serbia; Germany backed Austria-Hungary. The regional dispute was now tied to great-power commitments.",
  },
  {
    title: "Mobilization Trap",
    detail:
      "Once Russia mobilized, Germany followed. Timetables and war plans accelerated events faster than diplomacy could slow them.",
  },
  {
    title: "Belgium Breached",
    detail:
      "Germany executed the Schlieffen Plan by invading Belgium, pulling Britain into the conflict to defend Belgian neutrality.",
  },
  {
    title: "A Continental War",
    detail:
      "Declarations of war cascaded across Europe. A crisis that might have been contained became a world war.",
  },
];

const levers = [
  {
    label: "Nationalism",
    text: "Rival ethnic and imperial ambitions made compromise look like surrender.",
  },
  {
    label: "Alliance Commitments",
    text: "Defensive pacts turned a bilateral dispute into a multi-power obligation.",
  },
  {
    label: "Militarization",
    text: "War plans and mobilization schedules created a built-in momentum for escalation.",
  },
  {
    label: "Miscalculation",
    text: "Leaders believed limited war was possible, underestimating the chain reaction.",
  },
];

export default function WW1OriginsPage() {
  return (
    <div className="min-h-screen bg-page-bg text-ink">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -left-24 top-0 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,#f6e39a,transparent_65%)] opacity-60 blur-2xl" />
          <div className="absolute right-0 top-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,#c24e42,transparent_60%)] opacity-25 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-[240px] w-[720px] -translate-x-1/2 bg-[linear-gradient(90deg,rgba(26,42,64,0),rgba(26,42,64,0.08),rgba(26,42,64,0))]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-16 md:pb-16 md:pt-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-border-beige bg-card-bg px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-accent-brown">
              1914 · A Chain Reaction
            </span>
            <h1 className="ww1-hero-title mt-6 text-4xl font-bold leading-tight text-navy md:text-5xl lg:text-6xl">
              The Domino Effect That Ignited World War I
            </h1>
            <p className="ww1-hero-subtitle mt-6 text-lg text-slate md:text-xl">
              What began as a single political assassination became a continent-wide catastrophe because each
              decision triggered the next. The crisis moved like falling dominoes: deliberate, rapid, and
              nearly impossible to stop once it started.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="rounded-3xl border border-border-beige bg-card-bg/80 p-6 shadow-[0_30px_60px_rgba(36,27,21,0.12)] backdrop-blur">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-navy">Dominoes in Motion</h2>
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-green">
                  6 steps
                </span>
              </div>
              <div className="mt-6 space-y-5">
                {dominoes.map((item, index) => (
                  <div
                    key={item.title}
                    className="ww1-domino-card rounded-2xl border border-border-beige/70 bg-page-bg/80 p-4 shadow-[0_14px_30px_rgba(26,42,64,0.08)] transition-all duration-500 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 120}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-accent-amber text-xs font-bold text-ink">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-base font-semibold text-navy">{item.title}</h3>
                        <p className="mt-2 text-sm text-slate">{item.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-3xl border border-border-beige bg-section-bg/80 p-6 shadow-[0_20px_40px_rgba(26,42,64,0.1)]">
                <h2 className="text-xl font-semibold text-navy">Why the Dominoes Fell</h2>
                <p className="mt-3 text-sm text-slate">
                  The assassination was only the first tile. Deep structural tensions ensured that each move
                  narrowed options, turning choices into obligations.
                </p>
                <div className="mt-6 grid gap-4">
                  {levers.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-border-beige bg-card-bg/70 p-4"
                    >
                      <p className="text-sm font-semibold text-accent-burgundy">{item.label}</p>
                      <p className="mt-2 text-sm text-slate">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-border-beige bg-card-bg/90 p-6 shadow-[0_24px_46px_rgba(36,27,21,0.12)]">
                <h2 className="text-xl font-semibold text-navy">The Point of No Return</h2>
                <p className="mt-3 text-sm text-slate">
                  Once mobilization began, war plans left little room for diplomacy. Railway schedules and
                  military timetables turned political decisions into automatic escalation.
                </p>
                <div className="mt-6 flex items-center gap-4 rounded-2xl border border-dashed border-accent-brown/50 bg-page-bg/80 p-4">
                  <div className="text-3xl font-bold text-accent-brown">1914</div>
                  <p className="text-sm text-slate">
                    The crisis moved from a regional conflict to a global war in just over five weeks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-8 md:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)]">
          <div className="rounded-3xl border border-border-beige bg-card-bg p-6 shadow-[0_22px_44px_rgba(26,42,64,0.12)]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-navy">Infographic: The Chain Reaction</h2>
              <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-accent-green">
                visual
              </span>
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border border-border-beige bg-page-bg">
              <img
                src="/infographics/ww1_origins.png"
                alt="Infographic showing the cascading origins of World War I"
                width={1200}
                height={800}
                className="h-auto w-full object-cover"
                loading="eager"
              />
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.35em] text-muted-gray">
              Source: Venetia Archives
            </p>
          </div>

          <div className="rounded-3xl border border-border-beige bg-section-bg/90 p-6 shadow-[0_20px_40px_rgba(26,42,64,0.1)]">
            <h2 className="text-xl font-semibold text-navy">From Spark to Conflagration</h2>
            <p className="mt-3 text-sm text-slate">
              The domino metaphor shows why the crisis was so hard to stop. Each move limited the next
              options, turning diplomacy into reaction.
            </p>
            <div className="mt-6 space-y-5 border-l border-accent-brown/40 pl-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-brown">
                  June 28
                </p>
                <p className="mt-2 text-sm text-slate">
                  Assassination in Sarajevo creates a demand for punishment and an opportunity to assert power.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-brown">
                  July 23-28
                </p>
                <p className="mt-2 text-sm text-slate">
                  The ultimatum and its rejection activate alliance expectations and set mobilization in motion.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-brown">
                  July 29-Aug 4
                </p>
                <p className="mt-2 text-sm text-slate">
                  Mobilizations, declarations, and the invasion of Belgium transform the crisis into a world war.
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-accent-green/40 bg-page-bg p-4">
              <p className="text-sm font-semibold text-navy">Takeaway</p>
              <p className="mt-2 text-sm text-slate">
                The First World War did not begin with a single decision, but with a sequence of irreversible
                reactions across interconnected states.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
