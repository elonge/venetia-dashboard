"use client";

import React from "react";
import { trackEvent } from "@/lib/mixpanel";

interface PrimarySourceProps {
  title: string;
  credibility: string;
  description: string;
  link?: string;
  author?: string;
  badgeColor?: "amber" | "stone";
}

export default function PrimarySource({
  title,
  credibility,
  description,
  link,
  author,
  badgeColor = "amber",
}: PrimarySourceProps) {
  const badgeColorClass =
    badgeColor === "amber"
      ? "text-amber-600/90"
      : "text-stone-400";

  const handleLinkClick = () => {
    if (!link) {
      return;
    }

    try {
      const url = new URL(link);
      if (!/(^|\.)amazon\./i.test(url.hostname)) {
        return;
      }
    } catch {
      return;
    }

    trackEvent(
      "About: Amazon Book Clicked",
      {
        title,
        author,
        link,
        pathname: "/about",
      },
      { transport: "sendBeacon" }
    );
  };

  const titleContent = link ? (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleLinkClick}
      className="font-bold text-stone-900 text-sm mb-1 hover:text-amber-600/90 transition-colors cursor-pointer"
    >
      {title}
    </a>
  ) : (
    <h4 className="font-bold text-stone-900 text-sm mb-1">{title}</h4>
  );

  return (
    <div className="flex flex-col">
      {titleContent}
      <span
        className={`text-[10px] font-bold uppercase tracking-widest ${badgeColorClass} mb-2`}
      >
        {credibility}
      </span>
      <p className="text-xs leading-relaxed text-stone-500">{description}</p>
    </div>
  );
}
