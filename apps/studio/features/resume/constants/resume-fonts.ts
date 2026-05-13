export const RESUME_FONT_IDS = ["geist", "modern", "inter"] as const;

export type ResumeFontFamilyId = (typeof RESUME_FONT_IDS)[number];

type ResumeFontScope = "editor" | "on-demand";

type ResumePdfFontFace = {
  src: string;
  fontWeight: number;
};

export interface ResumeFontRegistryEntry {
  id: ResumeFontFamilyId;
  label: string;
  primaryFamily: string;
  fallbackStack: string;
  stylesheetHref: string;
  scope: ResumeFontScope;
  pdfFonts: ResumePdfFontFace[];
}

const resumeFontDefinitions: ResumeFontRegistryEntry[] = [
  {
    id: "geist",
    label: "Geist Sans",
    primaryFamily: "Geist",
    fallbackStack: "Inter, 'Segoe UI', Arial, sans-serif",
    stylesheetHref:
      "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&display=swap",
    scope: "editor",
    pdfFonts: [
      { src: "/fonts/geist/Geist-Regular.ttf", fontWeight: 400 },
      { src: "/fonts/geist/Geist-Bold.ttf", fontWeight: 700 },
    ],
  },
  {
    id: "modern",
    label: "Manrope Grotesk",
    primaryFamily: "Manrope",
    fallbackStack: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    stylesheetHref:
      "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
    scope: "editor",
    pdfFonts: [
      { src: "/fonts/manrope/Manrope-Regular.ttf", fontWeight: 400 },
      { src: "/fonts/manrope/Manrope-Bold.ttf", fontWeight: 700 },
    ],
  },
  {
    id: "inter",
    label: "Inter",
    primaryFamily: "Inter",
    fallbackStack: "'Segoe UI', Arial, sans-serif",
    stylesheetHref:
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap",
    scope: "editor",
    pdfFonts: [
      { src: "/fonts/inter/Inter_18pt-Regular.ttf", fontWeight: 400 },
      { src: "/fonts/inter/Inter_18pt-Bold.ttf", fontWeight: 700 },
    ],
  },
];

const RESUME_FONT_ALIAS_MAP: Record<string, ResumeFontFamilyId> = {
  mono: "geist",
};

const RESUME_FONT_ID_SET = new Set<ResumeFontFamilyId>(
  resumeFontDefinitions.map((font) => font.id),
);

export const DEFAULT_RESUME_FONT_FAMILY: ResumeFontFamilyId = "geist";

export const RESUME_FONT_REGISTRY: Record<ResumeFontFamilyId, ResumeFontRegistryEntry> =
  Object.fromEntries(resumeFontDefinitions.map((font) => [font.id, font])) as Record<
    ResumeFontFamilyId,
    ResumeFontRegistryEntry
  >;

export function isResumeFontFamilyId(value: string): value is ResumeFontFamilyId {
  return RESUME_FONT_ID_SET.has(value as ResumeFontFamilyId);
}

export function normalizeResumeFontFamilyId(value: string | null | undefined): ResumeFontFamilyId {
  const normalized = (value ?? "").trim().toLowerCase();

  if (isResumeFontFamilyId(normalized)) {
    return normalized;
  }

  if (normalized in RESUME_FONT_ALIAS_MAP) {
    return RESUME_FONT_ALIAS_MAP[normalized];
  }

  return DEFAULT_RESUME_FONT_FAMILY;
}

export const resumeFontOptions: Array<{ value: ResumeFontFamilyId; label: string }> =
  resumeFontDefinitions.map((font) => ({
    value: font.id,
    label: font.label,
  }));

function toFontFamilyValue(font: ResumeFontRegistryEntry) {
  return `'${font.primaryFamily}', ${font.fallbackStack}`;
}

export const RESUME_FONT_FAMILY_MAP: Record<ResumeFontFamilyId, string> = Object.fromEntries(
  resumeFontDefinitions.map((font) => [font.id, toFontFamilyValue(font)]),
) as Record<ResumeFontFamilyId, string>;

export function getResumeFontStylesheetHref(fontFamily: string | null | undefined) {
  const normalized = normalizeResumeFontFamilyId(fontFamily);
  return RESUME_FONT_REGISTRY[normalized].stylesheetHref;
}

export const RESUME_EDITOR_FONT_STYLESHEET_HREFS = resumeFontDefinitions
  .filter((font) => font.scope === "editor")
  .map((font) => font.stylesheetHref);
