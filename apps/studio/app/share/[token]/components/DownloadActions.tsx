"use client";

import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";
import { useState, useRef, useCallback } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@veriworkly/ui";

import type { ResumeData } from "@/types/resume";

interface DownloadActionsProps {
  resume: ResumeData;
  sharePreviewId: string;
}

export const DownloadActions = ({ resume, sharePreviewId }: DownloadActionsProps) => {
  return null;
};
