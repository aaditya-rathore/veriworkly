"use client";

import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";
import { useState, useRef, useCallback } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@veriworkly/ui";

import type { ResumeData } from "@/types/resume";

import {
  exportResumeAsPdf,
  exportResumeAsPng,
  exportResumeAsJpg,
} from "@/features/documents/export/pdf/export-pdf";

interface DownloadActionsProps {
  resume: ResumeData;
  sharePreviewId: string;
}

const exportFormats: Array<"pdf" | "png" | "jpg"> = ["pdf", "png", "jpg"];

export const DownloadActions = ({ resume, sharePreviewId }: DownloadActionsProps) => {
  const exportInFlightRef = useRef(false);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  const handleDownload = useCallback(
    async (format: "pdf" | "png" | "jpg") => {
      if (exportInFlightRef.current) return;

      exportInFlightRef.current = true;
      setDownloadingFormat(format);

      try {
        if (format === "pdf") {
          await exportResumeAsPdf(resume, sharePreviewId);
        } else if (format === "png") {
          await exportResumeAsPng(resume, sharePreviewId);
        } else {
          await exportResumeAsJpg(resume, sharePreviewId);
        }

        toast.success(`${format.toUpperCase()} export downloaded`);
      } catch (err: unknown) {
        const rawMessage = err instanceof Error ? err.message : "Download failed";
        toast.error(rawMessage);
      } finally {
        exportInFlightRef.current = false;
        setDownloadingFormat(null);
      }
    },
    [resume, sharePreviewId],
  );

  return (
    <div className="border-border bg-background flex items-center overflow-hidden rounded-full border shadow-sm dark:border-zinc-800">
      {exportFormats.map((format, index) => {
        const isActive = downloadingFormat === format;
        const isExporting = !!downloadingFormat;

        return (
          <Button
            size="sm"
            key={format}
            variant="ghost"
            disabled={isExporting}
            aria-label={`Download resume as ${format.toUpperCase()}`}
            onClick={() => handleDownload(format)}
            className={cn(
              "hover:bg-accent/10 hover:text-accent h-9 rounded-none px-4 text-[10px] font-bold tracking-widest uppercase transition-all",
              index !== 0 && "border-border border-l dark:border-zinc-800",
              isActive && "bg-accent/10 text-accent",
            )}
          >
            {isActive ? (
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            ) : (
              <Download className="mr-2 h-3 w-3 transition-transform group-hover:-translate-y-0.5" />
            )}
            {format}
          </Button>
        );
      })}
    </div>
  );
};
