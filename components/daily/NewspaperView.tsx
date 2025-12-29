import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import type { DayData } from "./types";

interface NewspaperViewProps {
  dayData: DayData;
}

// Helper to parse date from various formats
function parseDate(dateStr: string): Date | null {
  const datetimeMatch = dateStr.match(/datetime\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (datetimeMatch) {
    const [, year, month, day] = datetimeMatch;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export default function NewspaperView({ dayData }: NewspaperViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.parentElement?.clientWidth || 0;
        const targetWidth = 1024;
        // Ensure we don't scale up, only down
        const newScale = Math.min(parentWidth / targetWidth, 1);
        setScale(newScale);
      }
    };

    // Use a small delay to ensure parent has rendered
    const timer = setTimeout(updateScale, 50);
    window.addEventListener('resize', updateScale);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  const date = parseDate(dayData.date);
  // Use uppercase for the date to match the newspaper style
  const formattedDate = date ? format(date, "EEEE, MMMM d, yyyy").toUpperCase() : dayData.date.toUpperCase();

  const content = {
    date: formattedDate,
    leftColumn: {
      headline: "THE MEDITERRANEAN\nPROBLEM.",
      subheads: ["TURKISH EMPIRE UNSTABLE.", "BALKAN STATES TURMOIL.", "ITALIAN SWOOP ON TRIPOLI."],
      body: {
        dropCap: "I",
        paragraphs: [
          "t is a scandal to all the Powers that the Balkan States should remain in a state of turmoil and insecurity which would be discreditable to the most backward of Southern American States.",
          dayData.pm_activities || "The Prime Minister's activities remain a subject of intense scrutiny in the current diplomatic climate.",
          dayData.venetia_activities || "The correspondence from Miss Stanley provides a unique lens into the private stakes of public life."
        ]
      }
    },
    middleColumn: {
      headline: "THE BETTER BILL.",
      subhead: "(A Dialogue.)",
      dialogue: {
        speaker: "VOTER",
        lines: [
          "“I hear thee speak of a Better Bill;",
          "And glorious emotions my bosom fill.",
          "Leader! who cares not for Ayes or Noes,",
          "What does this wonderful Bill propose?”"
        ]
      }
    },
    rightColumn: {
      stories: [
        {
          title: "DAVIS CUP TENNIS.",
          subtitle: "WRIGHT BEATEN.",
          content: "The victory of Mr. Brookes over Mr. Wright is what have been anticipated by most observers."
        },
        {
          title: "WEATHER REPORT",
          content: dayData.weather ? `The day was marked by ${dayData.weather}.` : "No specific weather data recorded for this period."
        }
      ]
    }
  };

  return (
    <div ref={containerRef} className="w-full flex justify-center items-start overflow-hidden">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
          
          .newspaper-scaler {
            transform-origin: top center;
            width: 1024px;
            height: 565px;
            position: relative;
            background-image: url('/newspaper_empty.jpg');
            background-size: cover;
            background-position: center;
            box-shadow: 0 20px 50px rgba(0,0,0,0.2), inset 0 0 100px rgba(0,0,0,0.1);
          }

          .ink-print {
            color: #1a1614;
            mix-blend-mode: multiply;
            opacity: 0.88;
            filter: blur(0.2px) contrast(1.1);
          }

          .header-font {
            font-family: 'Playfair Display', serif;
            font-weight: 900;
            letter-spacing: -0.04em;
            transform: scaleX(0.85);
            display: inline-block;
          }

          .body-font {
            font-family: 'Crimson Text', serif;
            line-height: 1.02;
            letter-spacing: -0.01em;
            text-align: justify;
            text-justify: inter-word;
          }
        `}
      </style>

      <div 
        className="newspaper-scaler"
        style={{ transform: `scale(${scale})`, marginBottom: `-${565 * (1 - scale)}px` }}
      >
        {/* Date Overlay - Centered in the meta bar */}
        <div className="absolute top-[15.5%] left-[30%] right-[30%] text-center ink-print font-bold uppercase tracking-widest text-[11px] header-font">
          {content.date}
        </div>

        {/* Main Content Area */}
        <div className="absolute top-[24%] left-[6.5%] right-[6.5%] bottom-[6%] flex gap-[3%] items-stretch">
          
          {/* LEFT COLUMN */}
          <article className="w-[30%] flex flex-col items-center">
            <div className="text-center ink-print mb-[12px]">
              <h2 className="header-font uppercase leading-[0.85] text-[22px] mb-[6px] whitespace-pre-line">
                {content.leftColumn.headline}
              </h2>
              <div className="flex flex-col items-center gap-[1px] opacity-80 font-bold uppercase tracking-tighter text-[11px] italic">
                {content.leftColumn.subheads.map((sub, i) => (
                  <p key={i} className="border-b border-black/30 w-full pb-[1px]">{sub}</p>
                ))}
              </div>
            </div>

            <div className="ink-print body-font text-[13px] space-y-[6px] font-medium leading-[1.05]">
              <p>
                <span className="float-left text-[40px] font-black leading-[0.7] mr-[4px] mt-[4px]">
                  {content.leftColumn.body.dropCap}
                </span>
                {content.leftColumn.body.paragraphs[0]}
              </p>
              {content.leftColumn.body.paragraphs.slice(1).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </article>

          {/* MIDDLE COLUMN */}
          <article className="w-[34%] relative">
            <div className="border-[3px] border-double border-black p-[10px] h-full bg-[#fdfaf3]/10 ink-print">
              <div className="text-center mb-[10px] border-b border-black pb-[4px]">
                <h2 className="header-font uppercase text-[20px] leading-none mb-[2px]">
                  {content.middleColumn.headline}
                </h2>
                <p className="italic font-bold text-[9px] uppercase tracking-widest opacity-70">
                  {content.middleColumn.subhead}
                </p>
              </div>

              <div className="space-y-[10px] text-[13.5px] leading-[1.05] font-medium italic body-font">
                <div className="pl-[15px] -indent-[15px]">
                  <span className="not-italic uppercase text-[9px] font-black mr-[4px]">
                    {content.middleColumn.dialogue.speaker}:
                  </span> 
                  {content.middleColumn.dialogue.lines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}{i < content.middleColumn.dialogue.lines.length - 1 && <br/>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* RIGHT COLUMN */}
          <article className="w-[29%] space-y-[12px] ink-print">
            {content.rightColumn.stories.map((story, i) => (
              <div key={i} className="border-b border-black last:border-b-0 pb-[4px]">
                <h3 className="header-font uppercase text-[14px] text-center mb-[2px] tracking-tighter leading-none">
                  {story.title}
                </h3>
                {story.subtitle && (
                  <h4 className="text-center font-bold text-[9px] uppercase tracking-widest mb-[3px]">
                    {story.subtitle}
                  </h4>
                )}
                <p className="body-font text-[12px] leading-[1.05]">
                  {story.content}
                </p>
              </div>
            ))}
          </article>
        </div>
        
        {/* Visual Fold Line Overlay */}
        <div className="absolute inset-y-0 left-1/2 w-px bg-black/10 pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.1)]"></div>
      </div>
    </div>
  );
}
