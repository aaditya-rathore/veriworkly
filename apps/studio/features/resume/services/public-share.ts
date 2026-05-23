"use client";

import type { ResumeData } from "@/types/resume";
import {
  fetchShareLink as generalFetchShareLink,
  verifyShareLink as generalVerifyShareLink,
  type ShareLinkPayload as GeneralShareLinkPayload,
} from "@/features/documents/services/share-service";

export type ShareLinkPayload = Omit<GeneralShareLinkPayload<ResumeData>, "documentTitle"> & {
  resumeTitle: string;
};

export async function fetchShareLink(token: string) {
  const data = await generalFetchShareLink<ResumeData>(token);
  return {
    ...data,
    resumeTitle: data.documentTitle,
  } as ShareLinkPayload;
}

export async function verifyShareLink(token: string, password: string) {
  const data = await generalVerifyShareLink<ResumeData>(token, password);
  return {
    ...data,
    resumeTitle: data.documentTitle,
  } as ShareLinkPayload;
}
