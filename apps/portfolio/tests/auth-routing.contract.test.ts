import { describe, expect, it } from "vitest";

import { isPublicPlatformPath } from "@/proxy";

describe("portfolio auth routing contract", () => {
  it("keeps the portfolio landing and public portfolio views public", () => {
    expect(isPublicPlatformPath("/")).toBe(true);
    expect(isPublicPlatformPath("/pricing")).toBe(true);
    expect(isPublicPlatformPath("/user/gautam")).toBe(true);
    expect(isPublicPlatformPath("/portfolios/gautam")).toBe(true);
    expect(isPublicPlatformPath("/templates/signal/preview")).toBe(true);
  });

  it("makes current and future workspace sections private by default", () => {
    expect(isPublicPlatformPath("/editor")).toBe(false);
    expect(isPublicPlatformPath("/settings")).toBe(false);
    expect(isPublicPlatformPath("/analytics")).toBe(false);
    expect(isPublicPlatformPath("/dashboard")).toBe(false);
    expect(isPublicPlatformPath("/billing")).toBe(false);
    expect(isPublicPlatformPath("/preview/document-1")).toBe(false);
    expect(isPublicPlatformPath("/future-private-page")).toBe(false);
  });
});
