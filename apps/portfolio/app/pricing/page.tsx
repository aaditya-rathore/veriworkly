import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Build your VeriWorkly portfolio free and pay only when you are ready to publish.",
};

const shell = "mx-auto w-[min(1120px,calc(100%-48px))] max-sm:w-[min(100%-32px,1120px)]";
const features = [
  ["Unlimited editing and private previews", true, true],
  ["Every current and future portfolio template", true, true],
  ["Autosave and local draft cache", true, true],
  ["Live VeriWorkly subdomain publishing", false, true],
  ["Privacy-first views and referrer analytics", false, true],
  ["SEO metadata and social sharing image", false, true],
  ["Hosted portfolio images", false, true],
  ["Ad-free and watermark-free public site", false, true],
] as const;

export default function PricingPage() {
  return (
    <main className="min-h-dvh bg-[var(--color-paper)]">
      <nav className="border-b border-[var(--color-line)]">
        <div className={`${shell} flex min-h-[68px] items-center justify-between gap-4`}>
          <Link className="flex items-center gap-3 text-sm font-extrabold" href="/">
            <Image src="/veriworkly-logo.png" width={28} height={28} alt="" priority />
            VeriWorkly Portfolio
          </Link>
          <Link className="text-sm font-extrabold" href="/dashboard">Open workspace</Link>
        </div>
      </nav>

      <header className={`${shell} py-16 text-center sm:py-24`}>
        <p className="text-xs font-extrabold tracking-[.14em] text-[var(--color-accent)] uppercase">Simple portfolio pricing</p>
        <h1 className="mx-auto mt-4 max-w-4xl text-[clamp(3.7rem,8vw,7rem)] leading-[.92] font-semibold tracking-[-.095em]">
          Build free. Pay when you publish.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[var(--color-muted)]">
          Draft, preview, and refine without a deadline. Portfolio Pro unlocks public publishing and
          the tools needed to keep your site useful.
        </p>
      </header>

      <section className={`${shell} grid gap-4 pb-16 md:grid-cols-2`}>
        <Plan title="Free drafts" price="$0" note="No card required" action="Start building" href="/dashboard">
          Build privately with the complete editor and every available template.
        </Plan>
        <Plan featured title="Portfolio Pro" price="$12" suffix="/ month" note="Or $4 weekly and $120 yearly" action="Choose a publishing plan" href="/billing">
          Publish professionally with analytics, image hosting, SEO, and sharing controls.
        </Plan>
      </section>

      <section className={`${shell} pb-20`}>
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-panel)]">
          <div className="grid grid-cols-[minmax(0,1fr)_5rem_5rem] border-b border-[var(--color-line)] px-4 py-4 text-xs font-extrabold sm:grid-cols-[minmax(0,1fr)_9rem_9rem]">
            <span>Included</span><span className="text-center">Free</span><span className="text-center">Pro</span>
          </div>
          {features.map(([label, free, pro]) => (
            <div className="grid grid-cols-[minmax(0,1fr)_5rem_5rem] items-center border-b border-[var(--color-line)] px-4 py-4 text-sm last:border-0 sm:grid-cols-[minmax(0,1fr)_9rem_9rem]" key={label}>
              <span className="font-bold">{label}</span>
              <Feature enabled={free} />
              <Feature enabled={pro} />
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs leading-5 text-[var(--color-muted)]">
          Publishing plans are managed securely from your VeriWorkly Studio account.
        </p>
      </section>
    </main>
  );
}

function Plan({ title, price, suffix, note, action, href, featured, children }: { title: string; price: string; suffix?: string; note: string; action: string; href: string; featured?: boolean; children: React.ReactNode }) {
  return (
    <article className={`flex min-h-[360px] flex-col rounded-[var(--radius-md)] border p-6 sm:p-8 ${featured ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-panel)]" : "border-[var(--color-line)] bg-[var(--color-panel)]"}`}>
      <p className="text-sm font-extrabold">{title}</p>
      <p className="mt-8 text-6xl font-black tracking-[-.08em]">{price}<span className="ml-2 text-sm tracking-normal opacity-55">{suffix}</span></p>
      <p className="mt-2 text-xs font-bold opacity-55">{note}</p>
      <p className="mt-6 max-w-md text-sm leading-6 opacity-65">{children}</p>
      <Link className={`mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-sm)] px-4 text-sm font-extrabold ${featured ? "bg-[var(--color-panel)] text-[var(--color-ink)]" : "bg-[var(--color-accent)] text-[var(--color-accent-ink)]"}`} href={href}>
        {action} <ArrowRight size={15} />
      </Link>
    </article>
  );
}

function Feature({ enabled }: { enabled: boolean }) {
  return <span className="grid place-items-center text-[var(--color-muted)]">{enabled ? <Check size={15} className="text-[var(--color-accent)]" /> : <Minus size={14} />}</span>;
}
