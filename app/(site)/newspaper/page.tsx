import React from "react";

export default function NewspaperPage() {
  return (
    <div className="min-h-screen bg-[#2e2620] py-12 px-4 flex justify-center items-start overflow-auto selection:bg-amber-200/30">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
          
          .newspaper-container {
            position: relative;
            width: 100%;
            max-width: 1200px;
            aspect-ratio: 1024 / 565;
            background-image: url('/newspaper_empty2.jpg');
            background-size: cover;
            background-position: center;
            box-shadow: 0 30px 60px rgba(0,0,0,0.8), inset 0 0 100px rgba(0,0,0,0.1);
          }

          .ink-print {
            color: #1a1a1a;
            mix-blend-mode: multiply;
            opacity: 0.80;
            filter: contrast(1.1) brightness(0.9) blur(0.15px);
          }

          .header-font {
            font-family: 'Playfair Display', serif;
            font-weight: 900;
            letter-spacing: -0.02em;
          }

          .body-font {
            font-family: 'Crimson Text', serif;
            line-height: 1.05;
            letter-spacing: -0.01em;
            text-align: justify;
            text-justify: inter-word;
          }

          /* Relative units based on container width */
          .text-size-body { font-size: 1.1vw; }
          .text-size-headline { font-size: 2.2vw; }
          .text-size-subhead { font-size: 1.2vw; }
          .text-size-meta { font-size: 1.0vw; }
          
          @media (min-width: 1200px) {
            .text-size-body { font-size: 13.2px; }
            .text-size-headline { font-size: 26.4px; }
            .text-size-subhead { font-size: 14.4px; }
            .text-size-meta { font-size: 12px; }
          }
        `}
      </style>

      {/* The Newspaper Object */}
      <div className="newspaper-container">
        
        {/* 1. Date Overlay (In the meta bar) */}
        <div className="absolute top-[28.3%] left-[25%] right-[30%] text-center ink-print font-bold uppercase tracking-widest text-size-meta header-font">
          Tuesday, January 2, 1912.
        </div>

        {/* 2. Main Content Area */}
        <div className="absolute top-[31%] left-[12%] right-[12%] bottom-[6%] flex gap-[2%] items-stretch">
          
          {/* LEFT COLUMN */}
          <article className="w-[30%] flex flex-col items-center">
            <div className="text-center ink-print mb-[4%]">
              <h2 className="header-font uppercase leading-[0.9] text-size-headline mb-[3%]">
                The Mediterranean<br/>Problem.
              </h2>
              <div className="flex flex-col items-center gap-[0.2vw] opacity-80 font-bold uppercase tracking-tighter text-size-subhead italic">
                <p className="border-b border-black/40 w-full pb-[0.1vw]">Turkish Empire Unstable.</p>
                <p className="border-b border-black/40 w-full pb-[0.1vw]">Balkan States Turmoil.</p>
                <p className="border-b border-black/40 w-full pb-[0.1vw]">Italian Swoop on Tripoli.</p>
              </div>
            </div>

            <div className="ink-print body-font text-size-body space-y-[0.8vw] font-medium">
              <p>
                <span className="float-left text-[3.2vw] font-black leading-[0.7] mr-[0.4vw] mt-[0.5vw]">I</span>
                t is a scandal to all the Powers that the Balkan States should remain in a state of turmoil and insecurity which would be discreditable to the most backward of Southern American States.
              </p>
              <p>
                It is a danger to all Europe that the Turkish Empire should be so unstable as to be both a provocation and a temptation to its neighbours in Europe. Nothing but the jealousies of the Powers prevents the speedy solution...
              </p>
              <p>
                The Italian swoop upon Tripoli was in the same line of events... in the unicuary sense and through the peace as for...
              </p>
            </div>
          </article>

          {/* MIDDLE COLUMN (The Boxed Dialogue) */}
          <article className="w-[34.5%] relative">
            <div className="border-[0.25vw] border-double border-black p-[0.3vw] h-auto bg-transparent ink-print">
              <div className="text-center mb-[1.2vw] border-b border-black pb-[0.5vw]">
                <h2 className="header-font uppercase text-size-headline leading-none mb-[0.2vw]">The Better Bill.</h2>
                <p className="italic font-bold text-[0.8vw] uppercase tracking-widest opacity-70">(A Dialogue.)</p>
              </div>

              <div className="space-y-[1.2vw] text-[1.15vw] leading-[0.9]! font-medium italic body-font">
                <div className="pl-[1.5vw] -indent-[1.5vw]">
                  <span className="not-italic uppercase text-[0.75vw] font-black mr-[0.5vw]">Voter:</span> 
                  “I hear thee speak of a Better Bill;<br/>
                  And glorious emotions my bosom fill.<br/>
                  Leader! who cares not for Ayes or Noes,<br/>
                  What does this wonderful Bill propose?”
                </div>
              </div>
            </div>
          </article>

          {/* RIGHT COLUMN (Mixed Stories) */}
          <article className="w-[28%] space-y-[1.5vw] ink-print">
            <div className="border-b border-black pb-[0.5vw]">
              <h3 className="header-font uppercase text-size-subhead text-center mb-[0.2vw] tracking-tighter">Davis Cup Tennis.</h3>
              <h4 className="text-center font-bold text-[0.7vw] uppercase tracking-widest mb-[0.4vw]">Wright Beaten.</h4>
              <p className="body-font text-[1vw] leading-[1.1]">
                Wright have been beaten in the first round of the Davis Cup. The victory have been beaten in the Davis Cup. The victory of Mr. Brookes over Mr. Wright is what have been anticipated.
              </p>
            </div>

            <div className="border-b border-black pb-[0.5vw]">
              <h3 className="header-font uppercase text-size-subhead text-center mb-[0.4vw] tracking-tighter">Test Match in Australia.</h3>
              <p className="body-font text-[1vw] leading-[1.1]">
                The Test match in Australia brings excitement. English victory seemed secure. 
              </p>
            </div>
          </article>

        </div>

        {/* 3. Subtle Fold Line Overlay */}
        <div className="absolute inset-y-0 left-1/2 w-px bg-black/5 pointer-events-none"></div>

      </div>
    </div>
  );
}
