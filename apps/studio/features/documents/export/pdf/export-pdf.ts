import type { ResumeData } from "@/types/resume";
import { getResumeFileBaseName } from "@/features/resume/services/resume-formatters";
import { buildExportHtml } from "@/features/resume/utils/build-export-html";
import { toPng, toJpeg } from "html-to-image";

function createExportIframe(html: string): Promise<HTMLIFrameElement> {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";

    // We must append to document before writing to it
    document.body.appendChild(iframe);

    iframe.onload = () => {
      // Wait a tiny bit for fonts to render inside the iframe
      setTimeout(() => resolve(iframe), 500);
    };

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
    } else {
      resolve(iframe);
    }
  });
}

function downloadDataUrl(dataUrl: string, fileName: string): void {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  link.click();
}

/**
 * Triggers a native print dialog for the user to save as PDF.
 * This perfectly preserves the HTML/CSS template styles, colors, and layout.
 */
export async function exportResumeAsPdf(resume: ResumeData, elementId: string): Promise<void> {
  const html = buildExportHtml(elementId);
  if (!html) throw new Error("Could not build export HTML");

  const iframe = await createExportIframe(html);

  try {
    iframe.contentWindow?.print();
  } finally {
    // We leave the iframe around for a moment so print dialog doesn't crash, then clean up
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 10000);
  }
}

/**
 * Triggers a download of the resume as a PNG image using html-to-image on the clean iframe
 */
export async function exportResumeAsPng(resume: ResumeData, elementId: string): Promise<void> {
  const html = buildExportHtml(elementId);
  if (!html) throw new Error("Could not build export HTML");

  const iframe = await createExportIframe(html);

  try {
    const doc = iframe.contentDocument;
    const target = doc?.getElementById("export-root");
    if (!target) throw new Error("Could not find root element for image export");

    // The iframe approach bypasses the global document.styleSheets CORS issue!
    const dataUrl = await toPng(target, { quality: 1, pixelRatio: 2 });
    downloadDataUrl(dataUrl, `${getResumeFileBaseName(resume)}.png`);
  } finally {
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
  }
}

/**
 * Triggers a download of the resume as a JPG image using html-to-image on the clean iframe
 */
export async function exportResumeAsJpg(resume: ResumeData, elementId: string): Promise<void> {
  const html = buildExportHtml(elementId);
  if (!html) throw new Error("Could not build export HTML");

  const iframe = await createExportIframe(html);

  try {
    const doc = iframe.contentDocument;
    const target = doc?.getElementById("export-root");
    if (!target) throw new Error("Could not find root element for image export");

    const dataUrl = await toJpeg(target, {
      quality: 0.95,
      pixelRatio: 2,
      backgroundColor: resume.customization.pageBackgroundColor || "#ffffff",
    });
    downloadDataUrl(dataUrl, `${getResumeFileBaseName(resume)}.jpg`);
  } finally {
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
  }
}
