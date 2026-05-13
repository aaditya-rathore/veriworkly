"use client";

import React from "react";
import type { ResumeData } from "@/types/resume";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  accentColor: string;
  borderColor: string;
}

export const Section: React.FC<SectionProps> = ({ title, children, accentColor, borderColor }) => {
  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center gap-3">
        <div className="h-px flex-1" style={{ backgroundColor: borderColor }} />
        <h2
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: accentColor }}
        >
          {title}
        </h2>
        <div className="h-px flex-1" style={{ backgroundColor: borderColor }} />
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
};
