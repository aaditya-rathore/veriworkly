"use client";

import React from "react";
import { formatDate } from "@/features/documents/utils/format-date";
import type { ResumeData } from "@/types/resume";

interface EducationItemProps {
  education: ResumeData["education"][0];
  textColor: string;
  mutedTextColor: string;
}

function stripEmoji(text: string): string {
  if (!text) return text;
  return text
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, "")
    .replace(/[\u{2600}-\u{27BF}]/gu, "")
    .replace(/[\u{2300}-\u{23FF}]/gu, "")
    .trim();
}

export const EducationItem: React.FC<EducationItemProps> = ({
  education,
  textColor,
  mutedTextColor,
}) => {
  return (
    <article className="space-y-1">
      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
        <h3 className="text-base font-semibold" style={{ color: textColor }}>
          {stripEmoji(education.studyType || education.area)}
        </h3>
        <p className="text-sm" style={{ color: mutedTextColor }}>
          {stripEmoji(formatDate(education.startDate))} –{" "}
          {stripEmoji(formatDate(education.endDate))}
        </p>
      </div>
      <p className="text-sm" style={{ color: mutedTextColor }}>
        {stripEmoji(education.institution)}
        {education.score ? ` • GPA: ${stripEmoji(education.score)}` : ""}
      </p>
    </article>
  );
};
