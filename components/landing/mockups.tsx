"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

function WindowChrome({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--card-shadow)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-surface-muted/70 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#d9b4a8]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#e2d3a4]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#b7c9b0]" />
        <p className="ml-2 truncate text-xs text-muted">{title}</p>
      </div>
      {children}
    </div>
  );
}

const SEARCH_QUERY = "Square D QO120 20A breaker";

const MATCHES = [
  {
    mpn: "QO120",
    name: "QO 20A 1-pole circuit breaker",
    manufacturer: "Square D",
    score: "96%",
    status: "Verified",
  },
  {
    mpn: "QO120-HID",
    name: "QO HID-rated 20A breaker",
    manufacturer: "Schneider Electric",
    score: "88%",
    status: "Qualified",
  },
  {
    mpn: "QO120CAFI",
    name: "QO combination AFCI breaker",
    manufacturer: "Square D",
    score: "81%",
    status: "Review",
  },
];

export function ProductSearchMockup() {
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"type" | "search" | "results">("type");

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];

    const run = () => {
      setTyped("");
      setPhase("type");
      SEARCH_QUERY.split("").forEach((_, index) => {
        timers.push(
          window.setTimeout(() => {
            if (!cancelled) {
              setTyped(SEARCH_QUERY.slice(0, index + 1));
            }
          }, 70 * index),
        );
      });

      timers.push(
        window.setTimeout(() => {
          if (!cancelled) {
            setPhase("search");
          }
        }, SEARCH_QUERY.length * 70 + 280),
      );

      timers.push(
        window.setTimeout(() => {
          if (!cancelled) {
            setPhase("results");
          }
        }, SEARCH_QUERY.length * 70 + 1500),
      );
    };

    run();
    const loop = window.setInterval(run, 9000);
    return () => {
      cancelled = true;
      window.clearInterval(loop);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return (
    <WindowChrome title="Comersly · Identify product">
      <div className="space-y-4 p-4 sm:p-5">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
            Target product search
          </p>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
            <span className="text-muted">⌕</span>
            <span className="min-h-5 flex-1 text-sm">
              {typed}
              <span className="ml-0.5 inline-block h-4 w-px bg-foreground align-middle pulse-dot" />
            </span>
          </div>
        </div>

        {phase === "search" ? (
          <div className="flex items-center gap-2 text-sm text-muted">
            <span className="h-2 w-2 rounded-full bg-accent pulse-dot" />
            Interpreting row and matching manufacturer evidence…
          </div>
        ) : null}

        {phase === "results" ? (
          <div>
            <p className="mb-2 text-xs font-medium text-muted">Found matches</p>
            <ul className="space-y-2">
              {MATCHES.map((match) => (
                <li
                  key={match.mpn}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{match.name}</p>
                    <p className="text-xs text-muted">
                      {match.manufacturer} · {match.mpn}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs font-semibold text-accent">
                      {match.score}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-medium",
                        match.status === "Verified" &&
                          "bg-[var(--badge-success-bg)] text-completed",
                        match.status === "Qualified" &&
                          "bg-accent-soft text-accent",
                        match.status === "Review" &&
                          "bg-[var(--badge-warning-bg)] text-review",
                      )}
                    >
                      {match.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : phase === "type" ? (
          <div className="h-32 rounded-xl bg-surface-muted shimmer" />
        ) : null}
      </div>
    </WindowChrome>
  );
}

export function DashboardMockup() {
  return (
    <WindowChrome title="Comersly workspace">
      <div className="grid gap-4 p-4 sm:grid-cols-[220px_minmax(0,1fr)] sm:p-5">
        <aside className="hidden rounded-xl bg-background p-3 sm:block">
          <p className="px-2 font-serif text-sm">Comersly</p>
          <nav className="mt-4 space-y-1 text-sm">
            {["Dashboard", "Imports", "Products", "Exports"].map((item, index) => (
              <div
                key={item}
                className={cn(
                  "rounded-lg px-2.5 py-2",
                  index === 0
                    ? "bg-accent-soft font-medium text-accent"
                    : "text-muted",
                )}
              >
                {item}
              </div>
            ))}
          </nav>
        </aside>
        <div className="min-w-0">
          <p className="text-xs text-muted">Good afternoon, Animesh</p>
          <h3 className="mt-1 font-serif text-2xl tracking-tight">
            Catalog intelligence
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ["1,284", "Products processed"],
              ["18", "Imports"],
              ["96%", "Verified identity"],
              ["7", "Needs review"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-xl border border-border bg-background px-3 py-2.5"
              >
                <p className="text-[11px] uppercase tracking-wide text-muted">
                  {label}
                </p>
                <p className="mt-1 text-lg font-semibold">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <div className="border-b border-border bg-surface-muted px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted">
              Recent products
            </div>
            {[
              ["QO120", "Square D", "Verified"],
              ["LV429630", "Schneider", "Enriched"],
              ["5SJ4106-7HG41", "Siemens", "Review"],
            ].map(([mpn, brand, status]) => (
              <div
                key={mpn}
                className="flex items-center justify-between border-b border-border px-3 py-2.5 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">{mpn}</p>
                  <p className="text-xs text-muted">{brand}</p>
                </div>
                <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WindowChrome>
  );
}

export function AccuracyMockup() {
  return (
    <WindowChrome title="Match confidence">
      <div className="space-y-3 p-4">
        {[
          ["QO120 · Square D", "96%"],
          ["LV429630 · Schneider", "91%"],
          ["NSX100N · unknown vendor label", "42%"],
        ].map(([label, score]) => (
          <div key={label}>
            <div className="mb-1 flex justify-between text-sm">
              <span>{label}</span>
              <span className="font-semibold text-accent">{score}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: score }}
              />
            </div>
          </div>
        ))}
      </div>
    </WindowChrome>
  );
}

export function LiveSourceMockup() {
  return (
    <WindowChrome title="Manufacturer sources">
      <div className="space-y-2 p-4">
        {[
          ["se.com/us/en/product/QO120", "Live", "Synced 2m ago"],
          ["Catalog PDF · 2024", "Stale", "Archived listing"],
          ["Distributor feed", "Ignored", "Supplier label only"],
        ].map(([source, status, note]) => (
          <div
            key={source}
            className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm">{source}</p>
              <p className="text-xs text-muted">{note}</p>
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-medium",
                status === "Live"
                  ? "bg-[var(--badge-success-bg)] text-completed"
                  : "bg-surface-muted text-muted",
              )}
            >
              {status}
            </span>
          </div>
        ))}
      </div>
    </WindowChrome>
  );
}

export function PromptMockup() {
  return (
    <WindowChrome title="Comersly AI pipeline" className="text-left">
      <div className="space-y-3 bg-white p-4 text-[#141816]">
        <p className="text-xs font-medium uppercase tracking-wide text-[#5f645f]">
          Plain-language instruction
        </p>
        <div className="rounded-xl border border-[#ddd8cc] bg-[#f7f6f1] px-3 py-3 text-sm leading-6">
          Identify this industrial breaker from a messy spreadsheet row. Confirm
          the manufacturer from live source pages, classify Dept / Class / Fine,
          enrich attributes, and write retail copy.
        </div>
        <div className="rounded-xl bg-[#141816] px-3 py-3 text-sm text-[#f7f6f1]">
          <p className="text-xs uppercase tracking-wide text-[#8fbfa8]">
            Pipeline
          </p>
          <p className="mt-1">
            Interpreting → verification → classification → enrichment → content
            → 252-column export
          </p>
        </div>
      </div>
    </WindowChrome>
  );
}
