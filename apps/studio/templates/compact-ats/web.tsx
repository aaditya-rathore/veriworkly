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
import { formatDate } from "@/features/documents/utils/format-date";
import { stripEmoji } from "@/features/documents/utils/strip-emoji";
import { isSectionVisible } from "@/features/documents/utils/section-helpers";

export const CompactAtsWeb: React.FC<TemplateRenderProps> = ({ resume }) => {
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

  const showBasics = isSectionVisible(sections, "basics") && Boolean(basics);
  const showSummary = isSectionVisible(sections, "summary") && summary;
  const showExperience = isSectionVisible(sections, "experience") && experience?.length > 0;
  const showEducation = isSectionVisible(sections, "education") && education?.length > 0;
  const showProjects = isSectionVisible(sections, "projects") && projects?.length > 0;
  const showSkills = isSectionVisible(sections, "skills") && skills?.length > 0;

  const bodyLineHeight = customization?.bodyLineHeight || 1.5;

  return (
    <div
      id="resume-container"
      className="mx-auto bg-white"
      style={{
        width: `${RESUME_PAGE_WIDTH_PX}px`,
        minHeight: `${RESUME_PAGE_HEIGHT_PX}px`,
        padding: `${RESUME_LAYOUT.pagePadding}px`,
        color: "#000",
        fontFamily:
          FONT_FAMILY_MAP[customization?.fontFamily as keyof typeof FONT_FAMILY_MAP] ||
          "Arial, Helvetica, sans-serif",
        fontSize: "10pt",
        lineHeight: bodyLineHeight,
      }}
    >
      {/* Header */}
      {showBasics && basics && (
        <div style={{ marginBottom: "12pt", paddingBottom: "6pt", borderBottom: "1px solid #000" }}>
          <div style={{ marginBottom: "3pt" }}>
            <div style={{ fontWeight: "bold", fontSize: "14pt", marginBottom: "2pt" }}>
              {stripEmoji(basics.fullName || "Your Name")}
            </div>
            {(basics.headline || basics.role) && (
              <div style={{ fontSize: "11pt", marginBottom: "2pt" }}>
                {stripEmoji(basics.headline || basics.role)}
              </div>
            )}
          </div>

          <div style={{ fontSize: "9pt", marginBottom: "2pt" }}>
            {basics.email && <span>{stripEmoji(basics.email)}</span>}
            {basics.phone && basics.email && <span> | </span>}
            {basics.phone && <span>{stripEmoji(basics.phone)}</span>}
            {basics.location && (basics.email || basics.phone) && <span> | </span>}
            {basics.location && <span>{stripEmoji(basics.location)}</span>}
          </div>

          {links?.items?.length > 0 && (
            <div style={{ fontSize: "9pt" }}>
              {links.items.map((link, index) => (
                <span key={index}>
                  {index > 0 && " | "}
                  {link.url}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      {showSummary && (
        <div style={{ marginBottom: "10pt" }}>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "11pt",
              marginBottom: "4pt",
              textTransform: "uppercase",
            }}
          >
            Summary
          </div>
          <div style={{ fontSize: "10pt" }}>{stripEmoji(summary)}</div>
        </div>
      )}

      {/* Experience */}
      {showExperience && (
        <div style={{ marginBottom: "10pt" }}>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "11pt",
              marginBottom: "4pt",
              textTransform: "uppercase",
            }}
          >
            Experience
          </div>
          <div style={{ fontSize: "10pt" }}>
            {experience.map((exp, index) => (
              <div key={exp.id} style={{ marginBottom: index < experience.length - 1 ? "6pt" : 0 }}>
                <div style={{ fontWeight: "bold", marginBottom: "2pt" }}>
                  {stripEmoji(exp.role)}
                  {exp.company && ` at ${stripEmoji(exp.company)}`}
                </div>
                {exp.location && (
                  <div style={{ marginBottom: "2pt", fontSize: "9pt" }}>
                    {stripEmoji(exp.location)}
                  </div>
                )}
                <div style={{ marginBottom: "2pt", fontSize: "9pt" }}>
                  {stripEmoji(formatDate(exp.startDate))} –{" "}
                  {exp.current ? "Present" : stripEmoji(formatDate(exp.endDate))}
                </div>
                {exp.summary && (
                  <div style={{ marginBottom: "2pt" }}>{stripEmoji(exp.summary)}</div>
                )}
                {exp.highlights?.length > 0 && (
                  <ul style={{ marginLeft: "20pt", marginBottom: "2pt", marginTop: "2pt" }}>
                    {exp.highlights.map((highlight, hIndex) => (
                      <li key={hIndex}>{stripEmoji(highlight)}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {showEducation && (
        <div style={{ marginBottom: "10pt" }}>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "11pt",
              marginBottom: "4pt",
              textTransform: "uppercase",
            }}
          >
            Education
          </div>
          <div style={{ fontSize: "10pt" }}>
            {education.map((edu, index) => (
              <div key={edu.id} style={{ marginBottom: index < education.length - 1 ? "6pt" : 0 }}>
                <div style={{ fontWeight: "bold", marginBottom: "2pt" }}>
                  {stripEmoji(edu.studyType || edu.area)}
                  {edu.institution && ` – ${stripEmoji(edu.institution)}`}
                </div>
                <div style={{ fontSize: "9pt", marginBottom: "2pt" }}>
                  {stripEmoji(formatDate(edu.startDate))} – {stripEmoji(formatDate(edu.endDate))}
                </div>
                {edu.score && <div style={{ fontSize: "9pt" }}>GPA: {stripEmoji(edu.score)}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {showProjects && (
        <div style={{ marginBottom: "10pt" }}>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "11pt",
              marginBottom: "4pt",
              textTransform: "uppercase",
            }}
          >
            Projects
          </div>
          <div style={{ fontSize: "10pt" }}>
            {projects.map((project, index) => (
              <div
                key={project.id}
                style={{ marginBottom: index < projects.length - 1 ? "6pt" : 0 }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "2pt" }}>
                  {stripEmoji(project.name)}
                  {project.url && ` – ${project.url}`}
                </div>
                {project.description && (
                  <div style={{ marginBottom: "2pt" }}>{stripEmoji(project.description)}</div>
                )}
                {project.highlights?.length > 0 && (
                  <ul style={{ marginLeft: "20pt", marginTop: "2pt" }}>
                    {project.highlights.map((highlight, hIndex) => (
                      <li key={hIndex}>{stripEmoji(highlight)}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {showSkills && (
        <div style={{ marginBottom: "10pt" }}>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "11pt",
              marginBottom: "4pt",
              textTransform: "uppercase",
            }}
          >
            Skills
          </div>
          <div style={{ fontSize: "10pt" }}>
            {skills.map((skill, index) => (
              <span key={skill.name}>
                {index > 0 && ", "}
                {stripEmoji(skill.name)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Custom Sections */}
      {customSections?.map((section) => (
        <div key={section.id} style={{ marginBottom: "10pt" }}>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "11pt",
              marginBottom: "4pt",
              textTransform: "uppercase",
            }}
          >
            {section.title}
          </div>
          <div style={{ fontSize: "10pt" }}>
            {section.items.map((item, itemIndex) => (
              <div
                key={item.id}
                style={{ marginBottom: itemIndex < section.items.length - 1 ? "6pt" : 0 }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "2pt" }}>
                  {stripEmoji(item.name)}
                  {item.date && ` – ${stripEmoji(item.date)}`}
                </div>
                {item.issuer && (
                  <div style={{ marginBottom: "2pt", fontSize: "9pt" }}>
                    {stripEmoji(item.issuer)}
                  </div>
                )}
                {item.description && (
                  <div style={{ marginBottom: "2pt" }}>{stripEmoji(item.description)}</div>
                )}
                {item.details?.length > 0 && (
                  <ul style={{ marginLeft: "20pt", marginTop: "2pt" }}>
                    {item.details.map((detail, dIndex) => (
                      <li key={dIndex}>{stripEmoji(detail)}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
