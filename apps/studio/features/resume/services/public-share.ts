"use client";

import type { ResumeData } from "@/types/resume";
import { fetchApiData } from "@/utils/fetchApiData";

export type ShareLinkPayload = {
  passwordRequired: boolean;
  resumeTitle: string;
  expiresAt: string | null;
  snapshot?: ResumeData;
  viewCount?: number;
};

export async function fetchShareLink(token: string) {
  return fetchApiData<ShareLinkPayload>(`/shares/${token}`, {
    errorMessage: "Shared resume not found",
  });
}

export async function verifyShareLink(token: string, password: string) {
  return fetchApiData<ShareLinkPayload>(`/shares/${token}/verify`, {
    method: "POST",
    body: JSON.stringify({ password }),
    errorMessage: "Invalid password",
  });
}
