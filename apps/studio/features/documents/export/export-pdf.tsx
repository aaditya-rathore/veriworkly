"use client";

import React from "react";
import { pdf } from "@react-pdf/renderer";

import type { ResumeData } from "@/types/resume";
import { getResumeFileBaseName } from "@/features/resume/services/resume-formatters";
import { loadTemplatePdfComponentById } from "@/templates/pdf";
import { registerPdfFont } from "@/templates/pdf/fonts";
import { downloadBlob } from "./download";

export async function exportResumeAsPdf(resume: ResumeData): Promise<void> {
  registerPdfFont(resume);

  const TemplatePdf = loadTemplatePdfComponentById(resume.templateId);
  const blob = await pdf(<TemplatePdf resume={resume} />).toBlob();

  downloadBlob(blob, `${getResumeFileBaseName(resume)}.pdf`);
}
