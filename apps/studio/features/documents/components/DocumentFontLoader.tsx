import { getFontStylesheetHref } from "@/features/documents/constants/fonts";

export function DocumentFontLoader({ fontFamily }: { fontFamily: string | null | undefined }) {
  const href = getFontStylesheetHref(fontFamily);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href={href} />
    </>
  );
}
