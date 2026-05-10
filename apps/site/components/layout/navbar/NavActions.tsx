"use client";

import Link from "next/link";

import { siteConfig } from "@/config/site";

import { Button } from "@veriworkly/ui";

import { GithubIcon } from "../SocialIcons";
import { ThemeToggle } from "../ThemeToggle";

export const NavActions = () => {
  return (
    <div className="hidden lg:flex items-center gap-4">
      <Link
        href={siteConfig.links.github}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted hover:text-foreground flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-accent/5"
      >
        <GithubIcon className="h-5 w-5" />
      </Link>

      <ThemeToggle />

      <Button
        asChild
        variant="primary"
        className="rounded-full px-7 font-bold shadow-lg shadow-accent/10 transition-all hover:shadow-accent/20 active:scale-95"
      >
        <Link href={siteConfig.links.app}>Start Building</Link>
      </Button>
    </div>
  );
};
