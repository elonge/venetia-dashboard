"use client";

import React from "react";

export default function NewspaperOverlay() {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Background Image */}
      <div className="relative">
        <img
          src="/newspaper_empty.jpg"
          alt="Newspaper background"
          className="w-full h-auto"
        />
        
        {/* Overlay Content */}
        <div className="absolute inset-0" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          {/* Date Line - Centered below masthead */}
          <div className="absolute" style={{ top: '11%', left: '0', right: '0', textAlign: 'center' }}>
            <p className="text-black tracking-[0.02em]" style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(11px, 1.2vw, 14px)' }}>
              TUESDAY, JANUARY 2, 1912.—ONE PENNY.
            </p>
          </div>

          {/* Three Column Layout */}
          <div className="absolute flex" style={{ top: '14%', left: '3.5%', right: '3.5%', bottom: '3%', gap: '1.8%' }}>
            {/* Left Column - THE MEDITERRANEAN PROBLEM */}
            <div className="flex-1 relative">
              {/* Main Heading */}
              <h2 className="font-bold text-black text-center mb-2.5 tracking-tight leading-tight" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 700, fontSize: 'clamp(18px, 2.2vw, 24px)' }}>
                THE MEDITERRANEAN PROBLEM.
              </h2>
              
              {/* Subheadings */}
              <div className="space-y-1.5 mb-3">
                <h3 className="font-bold text-black text-center tracking-tight leading-tight" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 700, fontSize: 'clamp(12px, 1.4vw, 14px)' }}>
                  TURKISH EMPIRE UNSTABLE.
                </h3>
                <h3 className="font-bold text-black text-center tracking-tight leading-tight" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 700, fontSize: 'clamp(12px, 1.4vw, 14px)' }}>
                  BALKAN STATES TURMOIL.
                </h3>
                <h3 className="font-bold text-black text-center tracking-tight leading-tight" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 700, fontSize: 'clamp(12px, 1.4vw, 14px)' }}>
                  ITALIAN SWOOP ON TRIPOLI.
                </h3>
              </div>

              {/* Body Text */}
              <div className="space-y-2.5 text-black leading-[1.5]" style={{ fontFamily: 'Georgia, "Times New Roman", serif', textAlign: 'justify', fontSize: 'clamp(9px, 1vw, 10px)' }}>
                <p>
                  It is a scandal to all the Powers that the Balkan States should remain in a state of turmoil and insecurity which would be discreditable to the most backward of Southern American States.
                </p>
                <p>
                  It is a danger to all Europe that the Turkish Empire should be so unstable as to be both a provocation and a temptation to its neighbours in Europe. Nothing but the jealousies of the Powers prevents the speedy solution of the Eastern Question, which has been a standing menace to the peace of Europe for more than a generation.
                </p>
                <p>
                  The Italian swoop upon Tripoli was in the same line of events. It was a bold stroke, executed with remarkable skill and rapidity, which has placed Italy in a position of great advantage in the Mediterranean. The consequences of this action are still unfolding, and it remains to be seen how the other Powers will respond to this challenge to the established order.
                </p>
              </div>
            </div>

            {/* Vertical Separator Line */}
            <div className="w-px bg-black/30"></div>

            {/* Middle Column - THE BETTER BILL */}
            <div className="flex-1 relative px-[1.5%]">
              {/* Main Heading */}
              <h2 className="font-bold text-black text-center mb-2 tracking-tight leading-tight" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 700, fontSize: 'clamp(18px, 2.2vw, 24px)' }}>
                THE BETTER BILL.
              </h2>
              
              {/* Sub-heading */}
              <p className="text-black text-center mb-3 italic" style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(9px, 1.1vw, 11px)' }}>
                (A Dialogue.)
              </p>

              {/* Dialogue Text */}
              <div className="space-y-2.5 text-black leading-[1.5]" style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(9px, 1vw, 10px)' }}>
                <div>
                  <p className="font-semibold inline">Voter:</p>
                  <p className="inline ml-1">I hear thee speak of a Better Bill; And glorious emotions my bosom fill. Leader! who cares not for Ayes or Noes, What does this wonderful Bill propose? Has it a plan in which I shall not Pay a penny, but the State the lot?</p>
                </div>
                <div>
                  <p className="font-semibold inline">Leader:</p>
                  <p className="inline ml-1">Not that, not that, my child!</p>
                </div>
                <div>
                  <p className="font-semibold inline">Voter:</p>
                  <p className="inline ml-1">So that master and man, in this happy land, Go forward together, each hand in hand, With 7d. a week from the master's till - Is that, dear Leader, your Bill?</p>
                </div>
                <div>
                  <p className="font-semibold inline">Leader:</p>
                  <p className="inline ml-1">You have not twigged it, gentle boy! The plan is simple, without alloy: You pay the blooming lot!</p>
                </div>
              </div>
            </div>

            {/* Vertical Separator Line */}
            <div className="w-px bg-black/30"></div>

            {/* Right Column - Sports and Notes */}
            <div className="flex-1 relative">
              {/* Davis Cup Tennis */}
              <div className="mb-3">
                <h2 className="font-bold text-black text-center mb-1.5 tracking-tight leading-tight" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 700, fontSize: 'clamp(18px, 2.2vw, 24px)' }}>
                  DAVIS CUP TENNIS.
                </h2>
                <h3 className="font-bold text-black text-center mb-1.5 tracking-tight leading-tight" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 700, fontSize: 'clamp(12px, 1.4vw, 14px)' }}>
                  WRIGHT BEATEN.
                </h3>
                <p className="text-black leading-[1.5]" style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(9px, 1vw, 10px)' }}>
                  Wright have been beaten in the first round of the Davis Cup. The victory have been beaten in the Davis Cup. The victory of Mr. Brookes over Mr. Wright is what have been anticipated.
                </p>
              </div>

              {/* Test Match */}
              <div className="mb-3">
                <h2 className="font-bold text-black text-center mb-1.5 tracking-tight leading-tight" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 700, fontSize: 'clamp(18px, 2.2vw, 24px)' }}>
                  TEST MATCH IN AUSTRALIA.
                </h2>
                <p className="text-black leading-[1.5]" style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(9px, 1vw, 10px)' }}>
                  The Test match in Australia brings excitement English victory seemed secure. Australian batsmen failed. The australian batsmen failed based on white again, and hostiss overssint as come to slim. o slim. The everal hiring, svines of sinsin- frynes lostler to in the muster math. The Imsn behod in the resd of the coanie site.
                </p>
              </div>

              {/* Notes of the Day */}
              <div>
                <h2 className="font-bold text-black text-center mb-1.5 tracking-tight leading-tight" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 700, fontSize: 'clamp(18px, 2.2vw, 24px)' }}>
                  NOTES OF THE DAY.
                </h2>
                <div className="space-y-2 text-black leading-[1.5]" style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(9px, 1vw, 10px)' }}>
                  <p>
                    None of the anticipations of those who have been fearful as to the sentiment of India towards the change of India's capital have been realised. The os the campaign includes memores of the change notvænenting of the residents on inswaon- hullting, and sopped more an innsiat in the Albert day.
                  </p>
                  <p>
                    Anti-Suffrage campaign programme includes a meeting in the Albert Hall. A wold by ampty
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

