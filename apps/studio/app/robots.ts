import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: [
          "/admin/",
          "/dashboard",
          "/editor",
          "/login",
          "/profile",
          "/settings",
          "/share/",
          "/api/",
          "/test",
          "/og-generator",
        ],
      },
    ],

    sitemap: [
      `${siteConfig.url}/sitemap.xml`,
      "https://blog.veriworkly.com/sitemap.xml",
      "https://docs.veriworkly.com/sitemap.xml",
    ],
  };
}
