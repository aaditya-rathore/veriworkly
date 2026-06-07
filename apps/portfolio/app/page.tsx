import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  Eye,
  LayoutTemplate,
  MoveUpRight,
  Search,
  Sparkles,
} from "lucide-react";
import { TemplateFrame } from "@/components/TemplateFrame";
import { templates } from "@/templates/catalog/templates";

const shell = "mx-auto w-[min(1240px,calc(100%-48px))] max-sm:w-[min(100%-32px,1240px)]";
const primary =
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-5 text-sm font-extrabold text-[var(--color-accent-ink)] transition hover:-translate-y-0.5";
const secondary =
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[var(--color-panel)] px-5 text-sm font-extrabold transition hover:-translate-y-0.5";

export default function HomePage() {
  return (
    <main className="bg-[var(--color-paper)]">
      <nav className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-[var(--color-paper-glass)] backdrop-blur-xl">
        <div className={`${shell} flex min-h-[68px] items-center justify-between gap-4`}>
          <Link href="/" className="inline-flex items-center gap-3 text-sm font-extrabold tracking-[-.03em] whitespace-nowrap">
            <Image src="/veriworkly-logo.png" width={28} height={28} alt="" priority />
            VeriWorkly Portfolio
          </Link>
          <div className="flex items-center gap-5 text-sm font-bold">
            <a className="max-md:hidden" href="#templates">Templates</a>
            <a className="max-md:hidden" href="#features">Features</a>
            <Link className="max-sm:hidden" href="/pricing">Pricing</Link>
            <Link href="/dashboard" className={primary}>Start building <ArrowRight size={15} /></Link>
          </div>
        </div>
      </nav>

      <section className={`${shell} grid min-h-[690px] grid-cols-[minmax(0,1fr)_20rem] items-end gap-16 py-20 max-[900px]:grid-cols-1 max-[900px]:gap-10 max-sm:min-h-0 max-sm:py-14`}>
        <div>
          <p className="flex items-center gap-2 text-xs font-extrabold tracking-[.14em] text-[var(--color-accent)] uppercase">
            <Sparkles size={14} /> Portfolio builder for serious work
          </p>
          <h1 className="mt-5 max-w-[900px] text-[clamp(4rem,8vw,7.4rem)] leading-[.92] font-semibold tracking-[-.1em] max-sm:text-[clamp(3.4rem,17vw,5.4rem)]">
            Make your work <span className="text-[var(--color-accent)]">easy to choose.</span>
          </h1>
          <p className="mt-7 max-w-[640px] text-lg leading-8 text-[var(--color-muted)]">
            Build a portfolio with clear stories, a flexible template system, and one focused
            workspace that stays easy to update.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className={primary}>Create your portfolio <ArrowRight size={16} /></Link>
            <a href="#templates" className={secondary}>Browse templates</a>
          </div>
        </div>
        <aside className="border-t-2 border-[var(--color-ink)]">
          <p className="py-4 text-xs font-extrabold tracking-[.12em] uppercase">One content system</p>
          {templates.map((template) => (
            <a className="group block border-t border-[var(--color-line)] py-4" href={`/templates/${template.id}/preview`} key={template.id}>
              <span className="flex items-center justify-between text-sm font-extrabold">
                {template.name}<MoveUpRight size={14} className="text-[var(--color-muted)] transition group-hover:text-[var(--color-accent)]" />
              </span>
              <span className="mt-1 block text-xs leading-5 text-[var(--color-muted)]">{template.audience}</span>
            </a>
          ))}
          <p className="border-t border-[var(--color-line)] py-4 text-xs leading-5 text-[var(--color-muted)]">
            Switch templates any time. Your content stays intact.
          </p>
        </aside>
      </section>

      <section className="bg-[var(--color-ink)] px-6 text-[var(--color-panel)] max-sm:px-4" id="templates">
        <TemplateFrame />
      </section>

      <section className={`${shell} py-24 max-sm:py-16`} id="features">
        <header className="max-w-3xl">
          <p className="text-xs font-extrabold tracking-[.14em] text-[var(--color-accent)] uppercase">Built around the work</p>
          <h2 className="mt-4 text-[clamp(3rem,6vw,5.5rem)] leading-[.94] font-semibold tracking-[-.09em]">
            A portfolio should be simple to maintain and difficult to ignore.
          </h2>
        </header>
        <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-line)] md:grid-cols-2">
          {[
            { Icon: LayoutTemplate, title: "A growing template library", copy: "Change the visual direction without moving content between disconnected layouts." },
            { Icon: Eye, title: "Live editing preview", copy: "See the complete portfolio while you refine each section, item, and image." },
            { Icon: Search, title: "Search and sharing controls", copy: "Shape titles, descriptions, social images, and your public VeriWorkly address." },
            { Icon: BarChart3, title: "Privacy-first analytics", copy: "Understand visits and referrers without turning your portfolio into a tracking product." },
          ].map(({ Icon, title, copy }) => (
            <article className="bg-[var(--color-panel)] p-6 sm:p-8" key={title}>
              <Icon size={20} className="text-[var(--color-accent)]" />
              <h3 className="mt-10 text-xl font-black tracking-[-.04em]">{title}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-[var(--color-muted)]">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--color-line)] bg-[var(--color-panel)]">
        <div className={`${shell} grid gap-10 py-20 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center`}>
          <div>
            <p className="flex items-center gap-2 text-xs font-extrabold tracking-[.12em] text-[var(--color-accent)] uppercase">
              <Check size={15} /> Draft free for as long as you need
            </p>
            <h2 className="mt-4 max-w-4xl text-[clamp(3rem,6vw,5rem)] leading-[.96] font-semibold tracking-[-.085em]">
              Pay only when your portfolio is ready to go live.
            </h2>
          </div>
          <article className="rounded-[var(--radius-md)] bg-[var(--color-ink)] p-6 text-[var(--color-panel)]">
            <p className="text-sm font-extrabold">Portfolio Pro</p>
            <p className="mt-6 text-5xl font-black tracking-[-.08em]">$12<span className="ml-2 text-sm tracking-normal text-[var(--color-panel)]/55">monthly</span></p>
            <p className="mt-3 text-sm leading-6 text-[var(--color-panel)]/60">Publishing, analytics, image hosting, SEO, and an ad-free public portfolio.</p>
            <Link className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-panel)] px-4 text-sm font-extrabold text-[var(--color-ink)]" href="/pricing">
              Compare plans <ArrowRight size={15} />
            </Link>
          </article>
        </div>
      </section>

      <footer className={`${shell} flex min-h-[100px] items-center justify-between gap-5 text-sm text-[var(--color-muted)] max-sm:flex-col max-sm:items-start max-sm:justify-center`}>
        <Link className="font-extrabold text-[var(--color-ink)]" href="/">VeriWorkly Portfolio</Link>
        <div className="flex gap-5 font-bold">
          <a href="#templates">Templates</a>
          <Link href="/pricing">Pricing</Link>
          <Link href="/dashboard">Open workspace</Link>
        </div>
      </footer>
    </main>
  );
}
