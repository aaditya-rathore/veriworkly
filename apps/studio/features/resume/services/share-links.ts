"use client";

import type { ResumeData } from "@/types/resume";
import { backendApiUrl } from "@/lib/constants";
import { ApiRequestError } from "@/utils/fetchApiData";

async function throwApiError(response: Response, fallbackMessage: string): Promise<never> {
  const payload = (await response.json().catch(() => ({}))) as {
    message?: string;
  };

  throw new ApiRequestError(payload.message || fallbackMessage, response.status);
}

type CreateShareLinkOptions = {
  password?: string;
  expiresAt?: string | null;
  noExpiry?: boolean;
};

type CreateShareLinkResult = {
  id: string;
  token: string;
  expiresAt: string | null;
};

export type ShareLinkItem = {
  id: string;
  token: string;
  expiresAt: string | null;
  passwordHash: string | null;
  viewCount: number;
  lastViewedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function createResumeShareLink(
  resume: ResumeData,
  options: CreateShareLinkOptions = {},
): Promise<CreateShareLinkResult> {
  const response = await fetch(backendApiUrl("/shares"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      documentId: resume.id,
      snapshot: resume,
      password: options.password || undefined,
      expiresAt: options.expiresAt ?? null,
      noExpiry: options.noExpiry ?? false,
    }),
  });

  if (!response.ok) {
    await throwApiError(response, "Failed to create share link");
  }

  const payload = (await response.json()) as {
    data: CreateShareLinkResult;
  };

  return payload.data;
}

export async function listResumeShareLinks(resumeId: string): Promise<ShareLinkItem[]> {
  const response = await fetch(backendApiUrl(`/shares/documents/${resumeId}`), {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    await throwApiError(response, "Failed to load share links");
  }

  const payload = (await response.json()) as { data: ShareLinkItem[] };

  return payload.data;
}

export async function revokeResumeShareLink(resumeId: string, shareLinkId: string) {
  const response = await fetch(
    backendApiUrl(`/shares/documents/${resumeId}/links/${shareLinkId}`),
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  if (!response.ok) {
    await throwApiError(response, "Failed to revoke share link");
  }
}
