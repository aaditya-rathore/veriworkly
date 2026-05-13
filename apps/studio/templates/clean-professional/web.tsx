"use client";

import React from "react";
import type { ResumeData, ResumeCustomSection } from "@/types/resume";
import type { TemplateRenderProps } from "@/types/template";
import {
  RESUME_LAYOUT,
  RESUME_PAGE_HEIGHT_PX,
  RESUME_PAGE_WIDTH_PX,
} from "@/features/resume/constants/resume-layout";
import { FONT_FAMILY_MAP } from "@/features/documents/constants/fonts";
import { Header } from "./Header";
import { Section } from "./Section";
import { ExperienceItem } from "./ExperienceItem";
import { EducationItem } from "./EducationItem";
import { ProjectItem } from "./ProjectItem";
import { stripEmoji } from "@/features/documents/utils/strip-emoji";
import { isSectionVisible } from "@/features/documents/utils/section-helpers";

function renderCustomSection(
  section: ResumeCustomSection,
  customization: ResumeData["customization"],
) {
  const textColor = customization?.textColor || "#1f2937";
  const mutedTextColor = customization?.mutedTextColor || "#6b7280";
  const accentColor = customization?.accentColor || "#000000";
  const borderColor = customization?.borderColor || "#e5e7eb";

  return (
    <Section
      key={section.id}
      title={section.title}
      accentColor={accentColor}
      borderColor={borderColor}
    >
      <div className="space-y-4">
        {section.items.map((item) => (
          <article className="space-y-2" key={item.id}>
            <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
              <h3 className="text-base font-semibold" style={{ color: textColor }}>
                {stripEmoji(item.name)}
              </h3>
              {item.date && (
                <p className="text-sm" style={{ color: mutedTextColor }}>
                  {stripEmoji(item.date)}
                </p>
              )}
            </div>
            {item.issuer && (
              <p className="text-sm" style={{ color: mutedTextColor }}>
                {stripEmoji(item.issuer)}
              </p>
            )}
            {item.description && (
              <p className="text-sm" style={{ color: textColor }}>
                {stripEmoji(item.description)}
              </p>
            )}
            {item.details?.length > 0 && (
              <ul className="space-y-1 pl-5 text-sm" style={{ color: textColor }}>
                {item.details.map((detail, index) => (
                  <li key={index} className="list-disc">
                    {stripEmoji(detail)}
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}

export const CleanProfessionalWeb: React.FC<TemplateRenderProps> = ({ resume }) => {
  const {
    basics,
    experience,
    education,
    projects,
    skills,
    summary,
    customization,
    sections,
    customSections,
    links,
  } = resume;

  const accentColor = customization?.accentColor || "#000000";
  const textColor = customization?.textColor || "#1f2937";
  const mutedTextColor = customization?.mutedTextColor || "#6b7280";
  const borderColor = customization?.borderColor || "#e5e7eb";
  const bodyLineHeight = customization?.bodyLineHeight || RESUME_LAYOUT.bodyLineHeight;

  const showBasics = isSectionVisible(sections, "basics") && Boolean(basics);
  const showSummary = isSectionVisible(sections, "summary") && summary;
  const showExperience = isSectionVisible(sections, "experience") && experience?.length > 0;
  const showEducation = isSectionVisible(sections, "education") && education?.length > 0;
  const showProjects = isSectionVisible(sections, "projects") && projects?.length > 0;
  const showSkills = isSectionVisible(sections, "skills") && skills?.length > 0;

  return (
    <div
      id="resume-container"
      className="mx-auto bg-white text-[0.9375rem] leading-relaxed"
      style={{
        width: `${RESUME_PAGE_WIDTH_PX}px`,
        minHeight: `${RESUME_PAGE_HEIGHT_PX}px`,
        padding: `${RESUME_LAYOUT.pagePadding}px`,
        color: textColor,
        fontFamily:
          FONT_FAMILY_MAP[customization?.fontFamily as keyof typeof FONT_FAMILY_MAP] ||
          "system-ui, -apple-system, sans-serif",
      }}
    >
      {showBasics && (
        <Header basics={basics} links={links} customization={customization} sections={sections} />
      )}

      {showSummary && (
        <Section title="Summary" accentColor={accentColor} borderColor={borderColor}>
          <p style={{ color: textColor, lineHeight: bodyLineHeight }}>{stripEmoji(summary)}</p>
        </Section>
      )}

      {showExperience && (
        <Section title="Experience" accentColor={accentColor} borderColor={borderColor}>
          <div className="space-y-4">
            {experience.map((exp) => (
              <ExperienceItem
                key={exp.id}
                experience={exp}
                textColor={textColor}
                mutedTextColor={mutedTextColor}
                bodyLineHeight={bodyLineHeight}
              />
            ))}
          </div>
        </Section>
      )}

      {showEducation && (
        <Section title="Education" accentColor={accentColor} borderColor={borderColor}>
          <div className="space-y-4">
            {education.map((edu) => (
              <EducationItem
                key={edu.id}
                education={edu}
                textColor={textColor}
                mutedTextColor={mutedTextColor}
              />
            ))}
          </div>
        </Section>
      )}

      {showProjects && (
        <Section title="Projects" accentColor={accentColor} borderColor={borderColor}>
          <div className="space-y-4">
            {projects.map((project) => (
              <ProjectItem
                key={project.id}
                project={project}
                textColor={textColor}
                mutedTextColor={mutedTextColor}
              />
            ))}
          </div>
        </Section>
      )}

      {showSkills && (
        <Section title="Skills" accentColor={accentColor} borderColor={borderColor}>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.name}
                className="rounded-full px-3 py-1 text-sm font-medium"
                style={{
                  backgroundColor: `${accentColor}15`,
                  color: accentColor,
                }}
              >
                {stripEmoji(skill.name)}
              </span>
            ))}
          </div>
        </Section>
      )}

      {customSections?.map((section) => renderCustomSection(section, customization))}
    </div>
  );
};
