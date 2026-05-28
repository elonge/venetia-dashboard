import React from "react";
import { MessageSquare, Info } from "lucide-react";
import { LocationReasonAnswer } from "@/types";
import { AsquithVenetiaProximity } from "../types";
import dynamic from "next/dynamic";

const ProximityMap = dynamic(
  () => import("@/components/data-room/ProximityMap"),
  {
    ssr: false,
  }
);

interface ActivitiesProps {
  hasMeeting?: boolean;
  meetingReason?: LocationReasonAnswer | null;
  pm_location?: string;
  pm_activities?: string;
  pm_mood_witness?: string;
  venetia_location?: string;
  venetia_activities?: string;
  pm_location_reason?: LocationReasonAnswer | string;
  venetia_location_reason?: LocationReasonAnswer | string;
  onShowReason: (person: string, reason: LocationReasonAnswer | string) => void;
  proximity?: AsquithVenetiaProximity | null;
}

export default function Activities({
  hasMeeting,
  meetingReason,
  pm_location,
  pm_activities,
  pm_mood_witness,
  venetia_location,
  venetia_activities,
  pm_location_reason,
  venetia_location_reason,
  onShowReason,
  proximity,
}: ActivitiesProps) {
  const pmCoords = proximity?.geo_coords?.pm;
  const venetiaCoords = proximity?.geo_coords?.venetia;
  const hasMapCoords =
    pmCoords?.lat != null &&
    pmCoords?.lng != null &&
    venetiaCoords?.lat != null &&
    venetiaCoords?.lng != null;

  const MapElement = (
    <div className="flex flex-col h-full gap-3">
      <div className="flex-1 w-full min-h-[192px] rounded-sm overflow-hidden border border-border-beige shadow-sm bg-card-bg relative">
        {hasMapCoords && pmCoords && venetiaCoords ? (
          <ProximityMap
            pm={{ lat: pmCoords.lat!, lng: pmCoords.lng! }}
            venetia={{ lat: venetiaCoords.lat!, lng: venetiaCoords.lng! }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-page-bg/30 text-muted-gray/30 text-xs uppercase font-bold tracking-widest">
            Map Unavailable
          </div>
        )}
      </div>

      {hasMeeting && (
        <div
          className={`flex items-center justify-center gap-2 py-2 px-3 bg-[#fdfcf8] border border-accent-green/20 rounded-sm shadow-sm
${
  meetingReason
    ? "cursor-pointer hover:scale-105 transition-all duration-300"
    : ""
}`}
          onClick={() =>
            meetingReason && onShowReason("Meeting", meetingReason)
          }
          title={meetingReason ? "Click to see why" : undefined}
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            <span className="text-[10px] font-black text-accent-green uppercase tracking-[0.2em]">
              In-Person Meeting
            </span>
            {meetingReason && (
              <span className="text-accent-green font-serif italic text-xs leading-none">
                ⓘ
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative pt-12">
      {/* 
        Layout: 
        Desktop: 3 columns (Asquith - Map - Venetia)
        Mobile: Stacked (Map - Asquith - Venetia) 
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {/* Mobile Only: Map appears first */}
        <div className="md:hidden">{MapElement}</div>

        {/* LEFT COL: Asquith */}
        <div className="md:col-span-1 flex flex-col h-full">
          {!pm_location && !pm_activities ? (
            /* PM Insufficient Data */
            <div className="bg-[#F9F7F1] rounded-sm p-6 border border-border-beige shadow-sm relative flex flex-col items-center justify-center text-center h-full min-h-[220px]">
              <div className="absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(-45deg,rgba(var(--color-section-bg-rgb),0.4),rgba(var(--color-section-bg-rgb),0.4)_1px,transparent_1px,transparent_10px)]"></div>

              <div className="relative z-10 opacity-60">
                <div className="w-16 h-20 bg-[#EFECE5] mx-auto mb-3 border-2 border-dashed border-[#D8D0C0] flex items-center justify-center">
                  <span className="text-2xl font-serif font-bold text-[#D8D0C0]">
                    ?
                  </span>
                </div>
                <h4 className="text-xs font-black text-navy uppercase tracking-[0.2em] mb-1">
                  H.H. Asquith
                </h4>
                <p className="text-xs text-muted-gray font-serif italic">
                  No correspondence or official record found.
                </p>
              </div>
            </div>
          ) : (
            /* PM Active Record */
            <div className="group bg-page-bg rounded-sm p-5 border border-border-beige shadow-sm transition-all duration-300 flex flex-col gap-4 h-full">
              {/* Photo & Caption Section */}
              <div className="shrink-0 flex flex-col items-center">
                {/* Portrait */}
                <div className="relative">
                  <div className="w-20 h-28 relative shadow-[2px_4px_6px_rgba(0,0,0,0.15)] rotate-[-1deg] group-hover:rotate-0 transition-transform duration-500 bg-section-bg border-4 border-card-bg overflow-hidden">
                    <img
                      src="/portraits/H_H_Asquith.jpg"
                      alt="H.H. Asquith"
                      className="w-full h-full object-cover grayscale sepia-[0.3]"
                    />
                  </div>
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-border-beige opacity-60 rotate-2"></div>
                </div>

                {/* Location Caption - Directly Under Photo */}
                {pm_location && (
                  <div
                    className={`mt-3 flex items-center gap-1.5 px-2 py-0.5 border border-accent-brown/40 rounded-sm bg-card-bg/50 backdrop-blur-[1px] shadow-sm
                            ${
                              pm_location_reason
                                ? "cursor-pointer hover:scale-105 transition-all duration-300"
                                : ""
                            }`}
                    onClick={() =>
                      pm_location_reason &&
                      onShowReason("H.H. Asquith", pm_location_reason)
                    }
                    title={pm_location_reason ? "Click to see why" : undefined}
                  >
                    <span className="text-[10px] font-bold text-accent-brown uppercase tracking-widest">
                      {pm_location}
                    </span>
                    {pm_location_reason && (
                      <span className="text-accent-green font-serif italic text-xs leading-none">
                        ⓘ
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="flex-1 space-y-3 px-1">
                {pm_activities && (
                  <div className="text-sm font-serif text-navy/90 leading-relaxed">
                    <span className="text-[10px] font-sans font-bold text-accent-brown uppercase tracking-wider block mb-0.5 opacity-70">
                      HIS DAY
                    </span>
                    {pm_activities}
                  </div>
                )}

                {pm_mood_witness && (
                  <div className="mt-2 bg-section-bg/50 p-2 rounded-sm border-l-2 border-accent-brown/30">
                    <p className="text-xs text-slate italic font-serif leading-relaxed">
                      &quot;{pm_mood_witness}&quot;
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* CENTER COL: Map (Desktop Only) */}
        <div className="hidden md:block md:col-span-1 h-full">{MapElement}</div>

        {/* RIGHT COL: Venetia */}
        <div className="md:col-span-1 flex flex-col h-full">
          {!venetia_location && !venetia_activities ? (
            /* Venetia Insufficient Data */
            <div className="bg-[#F9F7F1] rounded-sm p-6 border border-border-beige shadow-sm relative flex flex-col items-center justify-center text-center h-full min-h-[220px]">
              <div className="absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(-45deg,rgba(var(--color-section-bg-rgb),0.4),rgba(var(--color-section-bg-rgb),0.4)_1px,transparent_1px,transparent_10px)]"></div>

              <div className="relative z-10 opacity-60">
                <div className="w-16 h-20 bg-[#EFECE5] mx-auto mb-3 border-2 border-dashed border-[#D8D0C0] flex items-center justify-center">
                  <span className="text-2xl font-serif font-bold text-[#D8D0C0]">
                    ?
                  </span>
                </div>
                <h4 className="text-xs font-black text-navy uppercase tracking-[0.2em] mb-1">
                  Venetia Stanley
                </h4>
                <p className="text-xs text-muted-gray font-serif italic">
                  Location unknown.
                </p>
              </div>
            </div>
          ) : (
            /* Venetia Active Record */
            <div className="group bg-page-bg rounded-sm p-5 border border-border-beige shadow-sm transition-all duration-300 flex flex-col gap-4 h-full">
              {/* Photo & Caption Section */}
              <div className="shrink-0 flex flex-col items-center">
                {/* Portrait */}
                <div className="relative">
                  <div className="w-20 h-28 relative shadow-[2px_4px_6px_rgba(0,0,0,0.15)] rotate-[1deg] group-hover:rotate-0 transition-transform duration-500 bg-section-bg border-4 border-card-bg overflow-hidden">
                    <img
                      src="/portraits/Venetia_Stanley.jpg"
                      alt="Venetia Stanley"
                      className="w-full h-full object-cover grayscale sepia-[0.3]"
                    />
                  </div>
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-border-beige opacity-60 rotate-[-2deg]"></div>
                </div>

                {/* Location Caption - Directly Under Photo */}
                {venetia_location && (
                  <div
                    className={`mt-3 flex items-center gap-1.5 px-2 py-0.5 border border-accent-burgundy/40 rounded-sm bg-card-bg/50 backdrop-blur-[1px] shadow-sm
                            ${
                              venetia_location_reason
                                ? "cursor-pointer hover:scale-105 transition-all duration-300"
                                : ""
                            }`}
                    onClick={() =>
                      venetia_location_reason &&
                      onShowReason("Venetia Stanley", venetia_location_reason)
                    }
                    title={
                      venetia_location_reason ? "Click to see why" : undefined
                    }
                  >
                    <span className="text-[10px] font-bold text-accent-burgundy uppercase tracking-widest">
                      {venetia_location}
                    </span>
                    {venetia_location_reason && (
                      <span className="text-accent-green font-serif italic text-xs leading-none">
                        ⓘ
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="flex-1 space-y-3 px-1">
                {venetia_activities && (
                  <div className="text-sm font-serif text-navy/90 leading-relaxed">
                    <span className="text-[10px] font-sans font-bold text-accent-burgundy uppercase tracking-wider block mb-0.5 opacity-70">
                      HER DAY
                    </span>
                    {venetia_activities}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
