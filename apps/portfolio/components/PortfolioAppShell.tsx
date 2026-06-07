import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Plus, Search } from "lucide-react";
import { portfolioPublicUrl, veriworklyProductLinks } from "@/config/site";
import type { CloudPortfolioDraft } from "@/lib/portfolio";
import type { PortfolioWorkspaceBootstrap } from "@/store/portfolio-store";
import { WorkspaceNavigation } from "@/components/WorkspaceNavigation";

export function PortfolioAppShell({
  children,
  user,
  workspace,
}: {
  children: React.ReactNode;
  user: PortfolioWorkspaceBootstrap["user"];
  workspace: PortfolioWorkspaceBootstrap["workspace"];
}) {
  const draft = workspace?.draft as CloudPortfolioDraft | undefined;
  const initials = getInitials(user?.name || user?.email || "Portfolio user");

  return (
    <div className="min-h-dvh bg-[var(--color-paper)] text-[var(--color-ink)] lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="hidden border-r border-[var(--color-line)] bg-[var(--color-panel)] lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col">
        <Link className="flex min-h-[72px] items-center gap-3 border-b border-[var(--color-line)] px-5" href="/dashboard">
          <Image src="/veriworkly-logo.png" width={32} height={32} alt="VeriWorkly" priority />
          <span>
            <span className="block text-sm font-black tracking-[-.04em]">VeriWorkly</span>
            <span className="block text-[10px] font-bold tracking-[.12em] text-[var(--color-muted)] uppercase">Portfolio workspace</span>
          </span>
        </Link>
        <WorkspaceNavigation variant="desktop" />
        <div className="mt-auto border-t border-[var(--color-line)] p-3">
          <a
            className="flex items-center gap-3 rounded-[var(--radius-sm)] p-2.5 transition hover:bg-[var(--color-paper)]"
            href={`${veriworklyProductLinks.studio}/profile`}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-[var(--color-ink)] text-xs font-black text-[var(--color-panel)]">
              {initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-extrabold">{user?.name || "Your profile"}</span>
              <span className="mt-0.5 block truncate text-[10px] text-[var(--color-muted)]">{user?.email || "Manage in Studio"}</span>
            </span>
            <ExternalLink size={12} className="text-[var(--color-muted)]" />
          </a>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex min-h-[72px] items-center gap-3 border-b border-[var(--color-line)] bg-[var(--color-paper-glass)] px-4 backdrop-blur-xl sm:px-6">
          <WorkspaceNavigation variant="mobile" />
          <div className="hidden min-w-0 flex-1 items-center gap-3 md:flex">
            <Search size={15} className="text-[var(--color-muted)]" />
            <p className="truncate text-xs font-bold text-[var(--color-muted)]">
              Manage your portfolio, publishing, and audience
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {draft ? (
              <a
                className="hidden min-h-9 items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[var(--color-panel)] px-3 text-xs font-extrabold transition hover:-translate-y-0.5 sm:inline-flex"
                href={portfolioPublicUrl(draft.slug)}
                target="_blank"
                rel="noreferrer"
              >
                View site <ExternalLink size={12} />
              </a>
            ) : null}
            <Link
              className="inline-flex min-h-9 items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-ink)] px-3 text-xs font-extrabold text-[var(--color-panel)] transition hover:-translate-y-0.5"
              href="/editor"
            >
              <Plus size={14} /> Edit portfolio
            </Link>
            <Link
              aria-label="Portfolio profile"
              className="grid size-9 place-items-center rounded-[var(--radius-sm)] bg-[var(--color-accent-soft)] text-xs font-black text-[var(--color-accent)]"
              href="/profile"
            >
              {initials}
            </Link>
          </div>
        </header>
        <div className="min-h-[calc(100dvh-4.5rem)]">{children}</div>
      </div>
    </div>
  );
}

function getInitials(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "VW";
}
