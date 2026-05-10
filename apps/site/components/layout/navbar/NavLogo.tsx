import Link from "next/link";
import Image from "next/image";

import { siteConfig } from "@/config/site";

export const NavLogo = () => {
  return (
    <Link href="/" className="group flex items-center gap-3 transition-all active:scale-95">
      <div className="relative h-10 w-10 shrink-0">
        <Image
          src="/veriworkly-logo.png"
          alt="VeriWorkly Logo"
          width={40}
          height={40}
          priority
          className="h-full w-full object-contain"
        />
      </div>

      <span className="text-2xl font-bold tracking-tight">{siteConfig.shortName}</span>
    </Link>
  );
};
