import { EDITOR_FONT_STYLESHEET_HREFS } from "@/features/documents/constants/fonts";

export function FontStylesheetPreload() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      {EDITOR_FONT_STYLESHEET_HREFS.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
    </>
  );
}
