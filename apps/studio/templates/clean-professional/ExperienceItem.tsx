"use client";

import React from "react";
import { formatDate } from "@/features/documents/utils/format-date";
import type { ResumeData } from "@/types/resume";

interface ExperienceItemProps {
  experience: ResumeData["experience"][0];
  textColor: string;
  mutedTextColor: string;
  bodyLineHeight: number;
}

function stripEmoji(text: string): string {
  if (!text) return text;
  return text
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, "")
    .replace(/[\u{2600}-\u{27BF}]/gu, "")
    .replace(/[\u{2300}-\u{23FF}]/gu, "")
    .trim();
}

export const ExperienceItem: React.FC<ExperienceItemProps> = ({
  experience,
  textColor,
  mutedTextColor,
  bodyLineHeight,
}) => {
  return (
    <article className="space-y-2">
      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
        <h3 className="text-base font-semibold" style={{ color: textColor }}>
          {stripEmoji(experience.role)}
        </h3>
        <p className="text-sm" style={{ color: mutedTextColor }}>
          {stripEmoji(formatDate(experience.startDate))} –{" "}
          {experience.current ? "Present" : stripEmoji(formatDate(experience.endDate))}
        </p>
      </div>
      <p className="text-sm" style={{ color: mutedTextColor }}>
        {stripEmoji(experience.company)}
        {experience.location ? ` • ${stripEmoji(experience.location)}` : ""}
      </p>
      {experience.summary && (
        <p className="text-sm" style={{ color: textColor, lineHeight: bodyLineHeight }}>
          {stripEmoji(experience.summary)}
        </p>
      )}
      {experience.highlights?.length > 0 && (
        <ul className="space-y-1 pl-5 text-sm" style={{ color: textColor }}>
          {experience.highlights.map((highlight, index) => (
            <li key={index} className="list-disc">
              {stripEmoji(highlight)}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
};
