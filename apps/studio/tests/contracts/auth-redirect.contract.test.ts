import { describe, expect, it } from "vitest";

import { getSafeAuthCallback } from "@/lib/auth-redirect";
import { isInvalidSessionResponse } from "@/lib/invalid-session";
import { isPublicStudioPath } from "@/proxy";

describe("auth redirect contract", () => {
  it("keeps private Studio routes private by default", () => {
    expect(isPublicStudioPath("/")).toBe(false);
    expect(isPublicStudioPath("/documents")).toBe(false);
    expect(isPublicStudioPath("/future-private-page")).toBe(false);
  });

  it("keeps explicit public Studio routes available", () => {
    expect(isPublicStudioPath("/login")).toBe(true);
    expect(isPublicStudioPath("/share/user/resume")).toBe(true);
    expect(isPublicStudioPath("/robots.txt")).toBe(true);
  });

  it("accepts trusted return locations and rejects open redirects", () => {
    expect(getSafeAuthCallback("/documents?view=grid")).toBe("/documents?view=grid");
    expect(getSafeAuthCallback("https://portfolio.veriworkly.com/editor")).toBe(
      "https://portfolio.veriworkly.com/editor",
    );
    expect(getSafeAuthCallback("https://example.com/steal")).toBe("/");
    expect(getSafeAuthCallback("//example.com/steal")).toBe("/");
  });

  it("clears invalid sessions without treating ordinary missing resources as auth failures", () => {
    expect(isInvalidSessionResponse("/documents/missing", 401)).toBe(true);
    expect(isInvalidSessionResponse("/users/me", 404)).toBe(true);
    expect(isInvalidSessionResponse("/documents/missing", 404)).toBe(false);
  });
});
