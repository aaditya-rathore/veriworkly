export const RESUME_PAGE_WIDTH_PX = 794;
export const RESUME_PAGE_HEIGHT_PX = 1122;
export const RESUME_PDF_SCALE = 72 / 96;
export const RESUME_PAGE_WIDTH_PT = RESUME_PAGE_WIDTH_PX * RESUME_PDF_SCALE;
export const RESUME_PAGE_HEIGHT_PT = RESUME_PAGE_HEIGHT_PX * RESUME_PDF_SCALE;

export function pxToPt(value: number): number {
  return value * RESUME_PDF_SCALE;
}

export const RESUME_LAYOUT = {
  pagePadding: 32,
  sectionSpacing: 24,
  fontSize: 14,
  bodyLineHeight: 1.5,
  headingLineHeight: 1.1,
  headerNameSize: 30,
  headerRoleSize: 16,
  bodyTextSize: 12,
  mutedTextSize: 11,
  sectionTitleSize: 16,
  sectionTitleSpacing: 12,
  itemGap: 16,
} as const;
