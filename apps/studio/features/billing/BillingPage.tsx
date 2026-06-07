"use client";

import { useState } from "react";
import { Check, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@veriworkly/ui";
import { beginCheckout, openBillingPortal } from "@/features/billing/billing-api";
import type { BillingActivity, BillingSummary } from "@/features/billing/types";

const proFeatures = [
  "Live VeriWorkly subdomain publishing",
  "Privacy-first pageview and referrer analytics",
  "Custom SEO metadata and social sharing card",
  "High-speed avatar, project, and social image hosting",
  "Watermark-free and ad-free published portfolio",
];

export function BillingPage({
  billing,
  history,
}: {
  billing: BillingSummary | null;
  history: BillingActivity[];
}) {
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const open = async (interval: "seven_day" | "monthly" | "annual") => {
    setLoading(interval);
    setError("");
    try {
      window.location.assign((await beginCheckout(interval)).url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not start checkout.");
      setLoading("");
    }
  };
  const portal = async () => {
    setLoading("portal");
    setError("");
    try {
      window.location.assign((await openBillingPortal()).url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not open billing portal.");
      setLoading("");
    }
  };
  return (
    <main className="space-y-5">
      <header className="border-border bg-card grid gap-5 rounded-2xl border p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <p className="text-accent text-xs font-bold tracking-[0.18em] uppercase">Billing</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Build free. Pay only when you publish.
          </h1>
          <p className="text-muted mt-3 max-w-2xl text-sm leading-6">
            Every plan unlocks the same Portfolio Pro features. Choose how long you need your
            portfolio live.
          </p>
        </div>
        <div className="bg-background rounded-xl p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-accent h-4 w-4" />
            <span className="text-sm font-black">Current plan</span>
          </div>
          <p className="mt-3 text-2xl font-black">
            {billing?.plan === "PORTFOLIO_PRO" ? "Portfolio Pro" : "Free drafts"}
          </p>
          <p className="text-muted mt-1 text-sm">
            {billing?.status ?? "Unavailable"}
            {billing?.interval ? ` · ${billing.interval.replace("_", " ")}` : ""}
          </p>
          {billing?.currentPeriodEnd ? (
            <p className="text-muted mt-3 text-xs">
              {billing.cancelAtPeriodEnd ? "Access ends" : "Renews"}{" "}
              {new Date(billing.currentPeriodEnd).toLocaleDateString()}.
            </p>
          ) : null}
          {billing?.plan === "PORTFOLIO_PRO" ? (
            <Button
              className="mt-4 w-full"
              variant="secondary"
              loading={loading === "portal"}
              onClick={() => void portal()}
            >
              Manage subscription <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </header>
      {error ? (
        <p className="border-destructive/30 bg-destructive/5 text-destructive rounded-xl border p-3 text-sm">
          {error}
        </p>
      ) : null}
      <section className="grid gap-4 lg:grid-cols-3">
        <Plan
          disabled={Boolean(billing?.canPublish)}
          title="7 days"
          price="$4"
          note="Renews every 7 days"
          action="Start 7-day plan"
          loading={loading === "seven_day"}
          onClick={() => void open("seven_day")}
        />
        <Plan
          disabled={Boolean(billing?.canPublish)}
          featured
          title="Monthly"
          price="$12"
          note={
            billing?.eligibleForTrial
              ? "7 days free, then billed monthly"
              : "Flexible monthly billing"
          }
          action="Start monthly"
          loading={loading === "monthly"}
          onClick={() => void open("monthly")}
        />
        <Plan
          disabled={Boolean(billing?.canPublish)}
          title="Yearly"
          price="$120"
          note="Two months free each year"
          action="Start yearly"
          loading={loading === "annual"}
          onClick={() => void open("annual")}
        />
      </section>
      <section className="border-border bg-card grid gap-6 rounded-2xl border p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <h2 className="text-xl font-black">
            Portfolio Pro includes everything needed to publish professionally.
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {proFeatures.map((feature) => (
              <p className="flex gap-2 text-sm font-semibold" key={feature}>
                <Check className="text-accent mt-0.5 h-4 w-4 shrink-0" />
                {feature}
              </p>
            ))}
          </div>
        </div>
        <div className="border-border border-t pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
          <p className="text-sm font-black">Free always includes</p>
          <p className="text-muted mt-2 text-sm leading-6">
            Unlimited edits, private previews, autosave with local cache, and both Signal and
            Atelier templates.
          </p>
          <a
            className="text-accent mt-4 inline-block text-sm font-bold"
            href={process.env.NEXT_PUBLIC_PORTFOLIO_URL || "http://localhost:3004/editor"}
          >
            Continue building
          </a>
        </div>
      </section>
      <section className="border-border bg-card rounded-2xl border p-5">
        <h2 className="text-base font-black">Billing activity</h2>
        <div className="border-border mt-4 divide-y border-y">
          {history.length ? (
            history.map((item) => (
              <div className="flex justify-between gap-4 py-3 text-sm" key={item.id}>
                <span className="font-semibold">
                  {item.type.replace("subscription.", "Subscription ").replaceAll("_", " ")}
                </span>
                <time className="text-muted">
                  {new Date(item.processedAt ?? item.createdAt).toLocaleDateString()}
                </time>
              </div>
            ))
          ) : (
            <p className="text-muted py-4 text-sm">No billing activity yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}

function Plan({
  title,
  price,
  note,
  action,
  featured,
  disabled,
  loading,
  onClick,
}: {
  title: string;
  price: string;
  note: string;
  action: string;
  featured?: boolean;
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <article
      className={`border-border bg-card flex min-h-72 flex-col rounded-2xl border p-5 ${featured ? "ring-accent ring-2" : ""}`}
    >
      <div className="flex justify-between">
        <h2 className="font-black">{title}</h2>
        {featured ? (
          <span className="bg-accent/10 text-accent rounded-md px-2 py-1 text-[10px] font-black uppercase">
            Most flexible
          </span>
        ) : null}
      </div>
      <p className="mt-8 text-5xl font-black tracking-tight">{price}</p>
      <p className="text-muted mt-3 text-sm">{note}</p>
      <Button className="mt-auto w-full" disabled={disabled} loading={loading} onClick={onClick}>
        {disabled ? "Manage current plan" : action}
      </Button>
    </article>
  );
}
