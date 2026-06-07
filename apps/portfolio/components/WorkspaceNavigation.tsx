"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  CreditCard,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LayoutTemplate,
  Menu,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import { veriworklyProductLinks } from "@/config/site";

const portfolioNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/editor", label: "Portfolio editor", icon: LayoutTemplate },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/settings", label: "Settings", icon: Settings },
];

const productNav = [
  { href: `${veriworklyProductLinks.studio}/documents`, label: "Documents", icon: FileText },
  { href: `${veriworklyProductLinks.studio}/editor`, label: "Document builder", icon: BriefcaseBusiness },
  { href: veriworklyProductLinks.blog, label: "Blog", icon: BookOpen },
  { href: veriworklyProductLinks.docs, label: "Docs", icon: FileText },
  { href: `${veriworklyProductLinks.studio}/billing`, label: "Billing", icon: CreditCard },
];

export function WorkspaceNavigation({ variant }: { variant: "desktop" | "mobile" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const navigation = <NavigationContent pathname={pathname} onNavigate={() => setOpen(false)} />;

  if (variant === "desktop") return <div className="min-h-0 flex-1 overflow-y-auto p-3">{navigation}</div>;

  return (
    <>
      <button
        className="grid size-9 place-items-center rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[var(--color-panel)] lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open workspace navigation"
      >
        <Menu size={16} />
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 bg-[var(--color-ink)]/35 lg:hidden" onMouseDown={() => setOpen(false)}>
          <aside className="flex h-full w-[min(19rem,88vw)] flex-col bg-[var(--color-panel)] shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex min-h-[72px] items-center justify-between border-b border-[var(--color-line)] px-4">
              <p className="text-sm font-black">Portfolio workspace</p>
              <button className="grid size-9 place-items-center rounded-[var(--radius-sm)] hover:bg-[var(--color-paper)]" onClick={() => setOpen(false)} aria-label="Close workspace navigation"><X size={16} /></button>
            </div>
            <div className="overflow-y-auto p-3">{navigation}</div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

function NavigationContent({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  return (
    <nav aria-label="Portfolio workspace" className="space-y-7">
      <NavGroup label="Portfolio" items={portfolioNav} pathname={pathname} onNavigate={onNavigate} />
      <NavGroup label="VeriWorkly products" items={productNav} pathname={pathname} onNavigate={onNavigate} external />
    </nav>
  );
}

function NavGroup({ label, items, pathname, onNavigate, external }: { label: string; items: typeof portfolioNav; pathname: string; onNavigate: () => void; external?: boolean }) {
  return (
    <div>
      <p className="px-2 text-[10px] font-extrabold tracking-[.14em] text-[var(--color-muted)] uppercase">{label}</p>
      <div className="mt-2 space-y-1">
        {items.map(({ href, label: itemLabel, icon: Icon }) => {
          const active = !external && pathname === href;
          const className = `flex min-h-10 items-center gap-3 rounded-[var(--radius-sm)] px-2.5 text-xs font-extrabold transition ${
            active ? "bg-[var(--color-ink)] text-[var(--color-panel)]" : "text-[var(--color-muted)] hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)]"
          }`;
          return external ? (
            <a className={className} href={href} key={href} onClick={onNavigate}>
              <Icon size={15} /><span className="flex-1">{itemLabel}</span><ExternalLink size={11} className="opacity-45" />
            </a>
          ) : (
            <Link aria-current={active ? "page" : undefined} className={className} href={href} key={href} onClick={onNavigate}>
              <Icon size={15} /><span>{itemLabel}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
