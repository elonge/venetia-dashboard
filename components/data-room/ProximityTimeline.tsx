"use client";

import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ProximityChartPoint = {
  date: string;
  distance_km: number;
  status?: string;
};

function formatDateTick(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

function formatDistance(value: unknown) {
  return typeof value === "number" && Number.isFinite(value)
    ? `${value.toFixed(1)} km`
    : "—";
}

function ProximityTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload as ProximityChartPoint | undefined;
  return (
    <div className="bg-[#F5F0E8] border border-[#D4CFC4] rounded-sm px-3 py-2 text-xs shadow-xl">
      <p className="text-[#8B4513] mb-1 font-serif italic">{label}</p>
      <div className="flex flex-col gap-0.5">
        <p className="font-black uppercase tracking-wider text-[#1A2A40]">
          {formatDistance(row?.distance_km)}
        </p>
        <p className="text-[9px] text-[#A67C52] font-serif italic">Physical Separation</p>
      </div>
      {row?.status && (
        <div className="mt-2 pt-2 border-t border-[#D4CFC4]/50">
          <p className="text-[9px] text-[#4A7C59] font-bold uppercase tracking-widest">
            {row.status}
          </p>
        </div>
      )}
      <div className="mt-1 text-[8px] text-[#1A2A40]/30 uppercase tracking-widest text-right">
        [Click to Pin]
      </div>
    </div>
  );
}

export default function ProximityTimeline({
  points,
  height,
  maxDistanceKm,
  selectedDate,
  hoverDate,
  onHoverDate,
  onSelectDate,
}: {
  points: ProximityChartPoint[];
  height: number;
  maxDistanceKm?: number;
  selectedDate: string | null;
  hoverDate: string | null;
  onHoverDate: (date: string | null) => void;
  onSelectDate: (date: string) => void;
}) {
  const chartData = useMemo(
    () => points.slice().sort((a, b) => a.date.localeCompare(b.date)),
    [points]
  );

  const domainMax =
    typeof maxDistanceKm === "number" && Number.isFinite(maxDistanceKm)
      ? Math.max(1, Math.ceil(maxDistanceKm))
      : "auto";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        onMouseMove={(state: any) => {
          const label = state?.activeLabel;
          if (typeof label === "string") onHoverDate(label);
        }}
        onMouseLeave={() => onHoverDate(null)}
        onClick={(state: any) => {
          const label = state?.activeLabel;
          if (typeof label === "string") onSelectDate(label);
        }}
      >
        {/* 1. THE GRADIENT DEFINITION */}
        <defs>
          <linearGradient id="colorDistance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4A7C59" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#4A7C59" stopOpacity={0.05} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D4CFC4" opacity={0.6} />
        
        <XAxis
          dataKey="date"
          tickFormatter={formatDateTick}
          stroke="#D4CFC4"
          tick={{ fill: "#8B4513", fontSize: 8, fontFamily: 'serif' }}
          tickLine={false}
          axisLine={false}
          dy={10}
          interval="preserveStartEnd"
        />
        
        <YAxis
          domain={[0, domainMax as any]}
          stroke="#D4CFC4"
          tick={{ fill: "#8B4513", fontSize: 8, fontFamily: 'serif' }}
          tickLine={false}
          axisLine={false}
          width={35}
        />
        
        <Tooltip content={<ProximityTooltip />} cursor={{ stroke: "#8B4513", strokeWidth: 1, strokeDasharray: "4 4" }} />
        
        {/* 2. AREA COMPONENT (Soft Terrain) */}
        <Area
          type="monotone"
          dataKey="distance_km"
          stroke="#4A7C59"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorDistance)"
          connectNulls
          animationDuration={1500}
          /* Custom Dot Logic for Selected/Hover states */
          activeDot={{
             r: 5, 
             stroke: "#F5F0E8", 
             strokeWidth: 2, 
             fill: "#1A2A40" 
          }}
          dot={(dotProps: any) => {
            const date = dotProps?.payload?.date;
            if (typeof date !== "string") return <></>;
            const isSelected = date === selectedDate;
            
            // Only render a physical dot if it's the selected date
            if (isSelected) {
               return (
                  <circle
                    cx={dotProps.cx}
                    cy={dotProps.cy}
                    r={4}
                    fill="#1A2A40"
                    stroke="#F5F0E8"
                    strokeWidth={2}
                  />
               );
            }
            return <></>;
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}