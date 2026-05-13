"use client";

import React from "react";
import type { ResumeData } from "@/types/resume";

interface ProjectItemProps {
  project: ResumeData["projects"][0];
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

export const ProjectItem: React.FC<ProjectItemProps> = ({ project, textColor, mutedTextColor }) => {
  return (
    <article className="space-y-2">
      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
        <h3 className="text-base font-semibold" style={{ color: textColor }}>
          {stripEmoji(project.name)}
        </h3>
        {project.url && (
          <a
            href={project.url}
            className="text-sm underline"
            style={{ color: mutedTextColor }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit link
            <span className="sr-only">{project.url}</span>
          </a>
        )}
      </div>
      {project.description && (
        <p className="text-sm" style={{ color: textColor }}>
          {stripEmoji(project.description)}
        </p>
      )}
      {project.highlights?.length > 0 && (
        <ul className="space-y-1 pl-5 text-sm" style={{ color: textColor }}>
          {project.highlights.map((highlight, index) => (
            <li key={index} className="list-disc">
              {stripEmoji(highlight)}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
};
