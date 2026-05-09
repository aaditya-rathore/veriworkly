import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export const revalidate = 86400;

const publicRoutes = [
  {
    url: siteConfig.url,
    changeFrequency: "weekly" as const,
    priority: 1,
  },
  {
    url: "https://blog.veriworkly.com",
    changeFrequency: "weekly" as const,
    priority: 0.7,
  },
  {
    url: "https://docs.veriworkly.com",
    changeFrequency: "weekly" as const,
    priority: 0.7,
  },
] satisfies MetadataRoute.Sitemap;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    ...route,
    lastModified,
  }));
}
