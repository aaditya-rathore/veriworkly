import Link from "next/link";
import { ArrowRight, BarChart3, ExternalLink, Eye, MousePointer2 } from "lucide-react";

export type PortfolioAnalytics = {
  totalViews: number;
  daily: Array<{ date: string; count: number }>;
  referrers: Array<{ host: string; count: number }>;
};

export function PortfolioAnalyticsWorkspace({ analytics }: { analytics: PortfolioAnalytics | null }) {
  const daily = analytics?.daily.slice().reverse() ?? [];
  const max = Math.max(...daily.map((item) => item.count), 1);
  const recentViews = daily.reduce((total, item) => total + item.count, 0);
  const topReferrer = analytics?.referrers[0];

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 sm:py-9 xl:px-10">
      <header className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="text-xs font-extrabold text-[var(--color-accent)]">Portfolio analytics</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-.055em] sm:text-4xl">Useful signals without invasive tracking.</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">Understand how people find your public portfolio and which days bring the most attention.</p>
        </div>
        <Link className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-ink)] px-4 text-xs font-extrabold text-[var(--color-panel)]" href="/editor">Improve your portfolio <ArrowRight size={13} /></Link>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <Metric icon={<Eye size={16} />} label="All-time views" value={analytics?.totalViews ?? 0} detail="Since first publication" />
        <Metric icon={<BarChart3 size={16} />} label="Recent views" value={recentViews} detail={`${daily.length} active days shown`} />
        <Metric icon={<MousePointer2 size={16} />} label="Top source" value={topReferrer?.count ?? 0} detail={topReferrer?.host || "No referrer data yet"} />
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(20rem,.55fr)]">
        <article className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-panel)] p-5 sm:p-7">
          <div><p className="text-xs font-extrabold text-[var(--color-muted)]">Traffic history</p><h2 className="mt-1 text-xl font-black tracking-[-.04em]">Recent active days</h2></div>
          {daily.length ? (
            <div className="mt-8 flex h-64 items-end gap-1.5 border-b border-[var(--color-line)]">
              {daily.map((item) => <div className="group relative min-w-1 flex-1 bg-[var(--color-accent-soft)] transition hover:bg-[var(--color-accent)]" title={`${item.date}: ${item.count} views`} style={{ height: `${Math.max(3, (item.count / max) * 100)}%` }} key={item.date} />)}
            </div>
          ) : (
            <div className="mt-8 grid min-h-64 place-items-center rounded-[var(--radius-sm)] bg-[var(--color-paper)] p-6 text-center"><div><BarChart3 className="mx-auto text-[var(--color-muted)]" size={24} /><p className="mt-3 text-sm font-extrabold">Analytics start after publishing</p><p className="mt-1 text-xs text-[var(--color-muted)]">Publish your portfolio to begin collecting privacy-first traffic data.</p></div></div>
          )}
        </article>
        <aside className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-panel)] p-5">
          <p className="text-xs font-extrabold text-[var(--color-muted)]">Discovery</p>
          <h2 className="mt-1 text-xl font-black tracking-[-.04em]">Top referrers</h2>
          <div className="mt-5 space-y-1">
            {analytics?.referrers.length ? analytics.referrers.map((item) => <div className="flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-3 hover:bg-[var(--color-paper)]" key={item.host}><ExternalLink size={13} className="text-[var(--color-muted)]" /><span className="min-w-0 flex-1 truncate text-xs font-bold">{item.host}</span><span className="font-[family-name:var(--font-mono)] text-xs font-black tabular-nums">{item.count}</span></div>) : <p className="rounded-[var(--radius-sm)] bg-[var(--color-paper)] p-4 text-xs leading-5 text-[var(--color-muted)]">Referrer data will appear after visitors find your published portfolio.</p>}
          </div>
        </aside>
      </section>
    </main>
  );
}

function Metric({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: number; detail: string }) {
  return <article className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-panel)] p-5"><div className="flex items-center justify-between text-[var(--color-muted)]"><p className="text-xs font-extrabold">{label}</p>{icon}</div><p className="mt-7 text-4xl font-black tracking-[-.065em] tabular-nums">{value}</p><p className="mt-2 truncate text-[11px] text-[var(--color-muted)]">{detail}</p></article>;
}
