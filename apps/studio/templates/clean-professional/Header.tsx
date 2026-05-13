"use client";

import React from "react";
import type { ResumeData } from "@/types/resume";

interface HeaderProps {
  basics: ResumeData["basics"];
  links: ResumeData["links"];
  customization: ResumeData["customization"];
  sections: ResumeData["sections"];
}

function stripEmoji(text: string): string {
  if (!text) return text;
  return text
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, "")
    .replace(/[\u{2600}-\u{27BF}]/gu, "")
    .replace(/[\u{2300}-\u{23FF}]/gu, "")
    .trim();
}

function isSectionVisible(sections: ResumeData["sections"], key: string) {
  if (!sections || !Array.isArray(sections)) return true;
  const section = sections.find((item) => item.id === key);
  return section ? section.visible !== false : true;
}

export const Header: React.FC<HeaderProps> = ({ basics, links, customization, sections }) => {
  const accentColor = customization?.accentColor || "#000000";
  const textColor = customization?.textColor || "#1f2937";
  const mutedTextColor = customization?.mutedTextColor || "#6b7280";

  const showBasics = isSectionVisible(sections, "basics") && Boolean(basics);
  const showLinks = isSectionVisible(sections, "links") && links?.items?.length > 0;

  if (!showBasics && !showLinks) return null;

  return (
    <header
      className="mb-6 border-b pb-6"
      style={{ borderColor: customization?.borderColor || "#e5e7eb" }}
    >
      {showBasics && basics && (
        <div>
          <div className="mb-2 flex flex-wrap items-baseline gap-3">
            <h1 className="text-3xl font-bold" style={{ color: accentColor }}>
              {stripEmoji(basics.fullName || "Your Name")}
            </h1>
            {(basics.headline || basics.role) && (
              <p className="text-lg font-medium" style={{ color: mutedTextColor }}>
                {stripEmoji(basics.headline || basics.role)}
              </p>
            )}
          </div>

          <div
            className="flex flex-wrap gap-3"
            style={{ color: mutedTextColor, fontSize: "0.875rem" }}
          >
            {basics.email && <span>{stripEmoji(basics.email)}</span>}
            {basics.phone && <span>•</span>}
            {basics.phone && <span>{stripEmoji(basics.phone)}</span>}
            {basics.location && <span>•</span>}
            {basics.location && <span>{stripEmoji(basics.location)}</span>}
          </div>

          {showLinks && links?.items?.length > 0 && (
            <div
              className="mt-2 flex flex-wrap gap-3"
              style={{ color: mutedTextColor, fontSize: "0.875rem" }}
            >
              {links.items.map((link, index) => (
                <span key={index}>
                  {link.label || link.type}: {link.url}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {!showBasics && showLinks && links?.items?.length > 0 && (
        <div
          className="flex flex-wrap gap-3"
          style={{ color: mutedTextColor, fontSize: "0.875rem" }}
        >
          {links.items.map((link, index) => (
            <span key={index}>
              {link.label || link.type}: {link.url}
            </span>
          ))}
        </div>
      )}
    </header>
  );
};
