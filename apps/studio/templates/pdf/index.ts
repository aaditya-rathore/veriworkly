import type { PdfTemplateComponent } from "./types";
import { CleanProfessionalPdf } from "@/templates/clean-professional/pdf";
import { CompactAtsPdf } from "@/templates/compact-ats/pdf";

const pdfTemplateRegistry: Record<string, PdfTemplateComponent> = {
  "clean-professional": CleanProfessionalPdf,
  "compact-ats": CompactAtsPdf,
};

export function loadTemplatePdfComponentById(id: string | undefined): PdfTemplateComponent {
  return pdfTemplateRegistry[id || ""] || CleanProfessionalPdf;
}
