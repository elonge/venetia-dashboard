import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import LocationMap from './LocationMap';

const mockData = {
  quote: {
    text: '"My darling, the Cabinet was hell... I sat there writing to you while they droned on about shells and politics. Your letter this morning was the only light in this wretched day."',
    context: 'ASQUITH at Downing St. VENETIA in London. CRISIS: Shell Shortage.'
  },
  emotionalTone: "Asquith's letter reveals deep frustration with political pressures, combined with intense longing for Venetia. His tone shifts between weary resignation about Cabinet affairs and tender affection when addressing her directly.",
  parliament: 'Debate on Shell Shortage crisis. Heavy criticism of the government.',
  cabinet: "Intense discussions on munitions, political coalition, and Venetia's letters. Asquith under immense pressure.",
  newspaper: 'HEADLINES ON SHELL SCANDAL AND POLITICAL CRISIS. SPECULATION ABOUT GOVERNMENT COLLAPSE.',
  locations: [
    { person: 'Venetia', location: 'Manchester Square, London' },
    { person: 'Asquith', location: '10 Downing St' }
  ],
  otherPeople: [
    { name: 'Lloyd George', action: 'Pressed colleagues for immediate munitions reform.' },
    { name: 'Churchill', action: 'Downplayed panic but acknowledged supply failures.' },
    { name: 'The Times', action: 'Hinted at fractures inside the Cabinet.' },
    { name: 'Violet Asquith', action: "Privately alarmed by her father's exhaustion." }
  ]
};

export default function DayContent() {
  const [othersExpanded, setOthersExpanded] = useState(false);

  return (
    <div className="space-y-4">
      {/* Quote Card */}
      <div className="bg-[#F5F0E8] rounded-lg p-4 border-l-4 border-[#6B2D3C]">
        <p className="font-serif text-lg text-[#1A2A40] italic mb-2">
          {mockData.quote.text}
        </p>
        <p className="text-sm text-[#6B7280]">
          {mockData.quote.context}
        </p>
      </div>

      {/* Info Grid */}
      <div className="flex gap-4">
        {/* Locations Map */}
        <div className="w-80">
          <LocationMap />
          <div className="mt-2 space-y-1 text-xs">
            {mockData.locations.map((loc, idx) => (
              <div key={idx} className="text-[#4B5563]">
                <span className="font-semibold text-[#1A2A40]">{loc.person}:</span> {loc.location}
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="flex-1 space-y-3">
          <div className="bg-[#F5F0E8] rounded-lg p-4">
            <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
              Emotional Tone of Letter
            </h4>
            <p className="text-sm text-[#1A2A40] leading-relaxed">
              {mockData.emotionalTone}
            </p>
          </div>

          <div className="bg-[#F5F0E8] rounded-lg p-4">
            <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
              Parliament Activity:
            </h4>
            <p className="text-sm text-[#1A2A40]">{mockData.parliament}</p>
          </div>

          <div className="bg-[#F5F0E8] rounded-lg p-4">
            <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
              Cabinet Activity:
            </h4>
            <p className="text-sm text-[#1A2A40]">{mockData.cabinet}</p>
          </div>
        </div>
      </div>

      {/* What Others Did */}
      <div className="bg-[#F5F0E8] rounded-lg overflow-hidden">
        <button
          onClick={() => setOthersExpanded(!othersExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-[#E8E4DC] transition-colors"
        >
          <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
            What Others Did
          </h4>
          {othersExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#6B7280]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#6B7280]" />
          )}
        </button>
        {othersExpanded && (
          <div className="px-4 pb-4 space-y-3">
            {mockData.otherPeople.map((person, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="font-semibold text-[#1A2A40] text-sm min-w-[140px]">
                  {person.name}:
                </span>
                <span className="text-sm text-[#4B5563]">
                  {person.action}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Newspaper Banner */}
      <div className="bg-[#8B3A3A] rounded-lg p-4 text-center">
        <h4 className="text-xs font-semibold text-[#F5E6C8] uppercase tracking-wider mb-2">
          Newspaper:
        </h4>
        <p className="text-white font-serif text-lg font-bold tracking-wide">
          {mockData.newspaper}
        </p>
      </div>
    </div>
  );
}