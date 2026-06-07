import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  ExternalLink,
  Eye,
  FileText,
  LayoutTemplate,
  MoveUpRight,
  Settings,
  Sparkles,
} from "lucide-react";
import { portfolioPublicUrl, veriworklyProductLinks } from "@/config/site";
import { parsePortfolioContent, type CloudPortfolioDraft } from "@/lib/portfolio";
import type { Billing, Publication } from "@/store/portfolio-store";

const primaryAction = "inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-ink)] px-4 text-xs font-extrabold text-[var(--color-panel)] transition hover:-translate-y-0.5";
const secondaryAction = "inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[var(--color-panel)] px-4 text-xs font-extrabold transition hover:-translate-y-0.5";

export type PortfolioDashboardData = {
  user: { name?: string | null; email?: string | null } | null;
  workspace: { draft?: unknown; publication?: Publication; billing?: Billing } | null;
  analytics: { totalViews?: number } | null;
};

export function PortfolioDashboardWorkspace({ data }: { data: PortfolioDashboardData }) {
  const draft = data.workspace?.draft as CloudPortfolioDraft | undefined;
  const content = draft ? parsePortfolioContent(draft.content) : null;
  const visibleSections = content?.sections.filter((section) => section.visible).length ?? 0;
  const projectCount = content?.sections.find((section) => section.type === "projects")?.items.length ?? 0;
  const completedIdentity = content
    ? [content.identity.name, content.identity.headline, content.identity.bio, content.identity.email].filter((value) => value.trim()).length
    : 0;
  const readiness = Math.round(((completedIdentity + Math.min(visibleSections, 4)) / 8) * 100);
  const publicUrl = draft ? portfolioPublicUrl(draft.slug) : null;
  const isLive = data.workspace?.publication?.status === "LIVE";

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 sm:py-9 xl:px-10">
      <header className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="text-xs font-extrabold text-[var(--color-accent)]">Workspace overview</p>
          <h1 className="mt-2 max-w-4xl text-3xl font-black tracking-[-.055em] text-balance sm:text-4xl">
            Good {getTimeOfDay()}, {firstName(data.user?.name)}.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
            Keep your portfolio current, understand who is finding it, and move the rest of your
            VeriWorkly documents forward.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {publicUrl ? <a className={secondaryAction} href={publicUrl} target="_blank" rel="noreferrer">View live site <ExternalLink size={13} /></a> : null}
          <Link className={primaryAction} href="/editor">Continue editing <ArrowRight size={14} /></Link>
        </div>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Portfolio views" value={String(data.analytics?.totalViews ?? 0)} detail="All-time public views" icon={<Eye size={16} />} />
        <Metric label="Published sections" value={String(visibleSections)} detail={`${projectCount} project ${projectCount === 1 ? "story" : "stories"}`} icon={<LayoutTemplate size={16} />} />
        <Metric label="Readiness" value={`${readiness}%`} detail={readiness === 100 ? "Ready to share" : "Complete the remaining details"} icon={<Check size={16} />} />
        <Metric label="Publication" value={isLive ? "Live" : "Draft"} detail={draft ? `${draft.slug}.veriworkly.com` : "Create your first draft"} icon={<Sparkles size={16} />} />
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(19rem,.55fr)]">
        <article className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-panel)]">
          <div className="grid min-h-[22rem] md:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="flex flex-col p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold text-[var(--color-muted)]">Current portfolio</p>
                  <h2 className="mt-2 text-3xl font-black tracking-[-.055em]">{content?.identity.name || "Build your portfolio"}</h2>
                </div>
                <span className={`px-2.5 py-1 text-[10px] font-extrabold ${isLive ? "bg-[var(--color-success-soft)] text-[var(--color-success)]" : "bg-[var(--color-warning-soft)] text-[var(--color-warning)]"}`}>{isLive ? "Published" : "Private draft"}</span>
              </div>
              <p className="mt-5 max-w-xl text-sm leading-6 text-[var(--color-muted)]">{content?.identity.headline || "Add your professional headline and strongest work to create a clear public profile."}</p>
              <div className="mt-auto flex flex-wrap gap-2 pt-8">
                <Link className={primaryAction} href="/editor">Open portfolio editor <ArrowRight size={13} /></Link>
                <Link className={secondaryAction} href="/settings">Publishing settings <Settings size={13} /></Link>
              </div>
            </div>
            <div className="relative overflow-hidden border-t border-[var(--color-line)] bg-[var(--color-ink)] p-6 text-[var(--color-panel)] md:border-t-0 md:border-l">
              <div className="absolute inset-0 opacity-20 surface-grid" />
              <div className="relative flex h-full flex-col">
                <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[.12em] text-[var(--color-panel)]/50 uppercase">Portfolio health</p>
                <p className="mt-5 text-7xl font-black tracking-[-.1em] tabular-nums">{readiness}<span className="text-2xl text-[var(--color-panel)]/40">%</span></p>
                <div className="mt-auto space-y-3 pt-8 text-xs font-bold">
                  <HealthRow complete={completedIdentity === 4} label="Profile details" />
                  <HealthRow complete={visibleSections >= 2} label="Portfolio sections" />
                  <HealthRow complete={Boolean(content?.seo.title && content?.seo.description)} label="Search metadata" />
                  <HealthRow complete={isLive} label="Public publishing" />
                </div>
              </div>
            </div>
          </div>
        </article>

        <aside className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-panel)] p-5">
          <div className="flex items-center justify-between">
            <div><p className="text-xs font-extrabold text-[var(--color-muted)]">This week</p><h2 className="mt-1 text-lg font-black tracking-[-.04em]">Recommended next steps</h2></div>
            <MoveUpRight size={16} className="text-[var(--color-accent)]" />
          </div>
          <div className="mt-5 space-y-1">
            <Task href="/editor" title={projectCount ? "Refine your strongest project" : "Add your first project"} detail="Clear proof gives visitors a reason to contact you." />
            <Task href="/settings" title="Review search preview" detail="Make the shared link explain what you do." />
            <Task href="/analytics" title="Check portfolio reach" detail="See which sources are sending visitors." />
          </div>
        </aside>
      </section>

      <section className="mt-6">
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-xs font-extrabold text-[var(--color-muted)]">Across VeriWorkly</p><h2 className="mt-1 text-xl font-black tracking-[-.04em]">Your career workspace</h2></div>
          <a className="text-xs font-extrabold text-[var(--color-accent)]" href={veriworklyProductLinks.studio}>Open Studio</a>
        </div>
        <div className="mt-4 grid gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-line)] md:grid-cols-3">
          <ProductLink href={`${veriworklyProductLinks.studio}/documents`} icon={<FileText size={17} />} title="Documents" detail="Resume and cover letter drafts" />
          <ProductLink href={`${veriworklyProductLinks.studio}/editor`} icon={<LayoutTemplate size={17} />} title="Document builder" detail="Create a new career document" />
          <ProductLink href={veriworklyProductLinks.blog} icon={<BarChart3 size={17} />} title="Blog and guides" detail="Practical writing for better applications" />
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value, detail, icon }: { label: string; value: string; detail: string; icon: React.ReactNode }) {
  return <article className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-panel)] p-5"><div className="flex items-center justify-between text-[var(--color-muted)]"><p className="text-xs font-extrabold">{label}</p>{icon}</div><p className="mt-7 truncate text-4xl font-black tracking-[-.065em] tabular-nums">{value}</p><p className="mt-2 truncate text-[11px] text-[var(--color-muted)]">{detail}</p></article>;
}
function HealthRow({ complete, label }: { complete: boolean; label: string }) {
  return <div className="flex items-center gap-2"><span className={`grid size-4 place-items-center rounded-full ${complete ? "bg-[var(--color-success)]" : "bg-[var(--color-panel)]/12"}`}>{complete ? <Check size={10} /> : null}</span><span className={complete ? "" : "text-[var(--color-panel)]/50"}>{label}</span></div>;
}
function Task({ href, title, detail }: { href: string; title: string; detail: string }) {
  return <Link className="group block rounded-[var(--radius-sm)] px-3 py-3 transition hover:bg-[var(--color-paper)]" href={href}><span className="flex items-center justify-between gap-3 text-xs font-extrabold">{title}<ArrowRight size={12} className="text-[var(--color-muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]" /></span><span className="mt-1 block text-[11px] leading-5 text-[var(--color-muted)]">{detail}</span></Link>;
}
function ProductLink({ href, icon, title, detail }: { href: string; icon: React.ReactNode; title: string; detail: string }) {
  return <a className="group flex min-h-32 items-start gap-4 bg-[var(--color-panel)] p-5 transition hover:bg-[var(--color-paper)]" href={href}><span className="grid size-10 place-items-center rounded-[var(--radius-sm)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]">{icon}</span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-3 text-sm font-extrabold">{title}<ExternalLink size={12} className="text-[var(--color-muted)]" /></span><span className="mt-2 block text-xs leading-5 text-[var(--color-muted)]">{detail}</span></span></a>;
}
function firstName(name?: string | null) { return name?.trim().split(/\s+/)[0] || "there"; }
function getTimeOfDay() { const hour = new Date().getHours(); return hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening"; }
