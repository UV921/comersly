"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

const STAGES = [
  { id: "source", label: "Source row" },
  { id: "interpret", label: "Interpret" },
  { id: "verify", label: "Verify" },
  { id: "classify", label: "Classify" },
] as const;

const SAMPLE = {
  raw: [
    { column: "Mfg_Part_Num", value: "QO120" },
    { column: "Part_Desc", value: "20A 1P 120/240V plug-on circuit breaker" },
    { column: "E1_Brand", value: "SQD" },
    { column: "Part_Manuf", value: "SQUARE D" },
  ],
  interpreted: [
    {
      field: "manufacturerPartNumber",
      value: "QO120",
      sourceColumn: "Mfg_Part_Num",
      confidence: "HIGH" as const,
    },
    {
      field: "brand",
      value: "Square D",
      sourceColumn: "E1_Brand",
      confidence: "HIGH" as const,
    },
    {
      field: "manufacturer",
      value: "Schneider Electric",
      sourceColumn: "Part_Manuf",
      confidence: "MEDIUM" as const,
    },
  ],
  evidence: {
    url: "se.com/us/en/product/QO120",
    productName: "QO 20A 1-pole circuit breaker",
    brandName: "Square D",
    manufacturerName: "Schneider Electric",
  },
  classification: {
    dept: "Electrical",
    class: "Circuit Protection",
    fine: "Miniature Circuit Breakers",
    classpath:
      "Electrical > Circuit Protection > Miniature Circuit Breakers",
    confidence: "HIGH" as const,
    needsReview: false,
    reason:
      "Manufacturer page confirms a Square D QO miniature breaker. Dept, Class, and Fine follow the catalog path instead of the supplier label.",
  },
};

function Confidence({ value }: { value: "HIGH" | "MEDIUM" | "LOW" }) {
  const styles = {
    HIGH: "text-completed",
    MEDIUM: "text-brass",
    LOW: "text-review",
  } as const;

  return (
    <span className={cn("text-[11px] font-medium tracking-[0.14em]", styles[value])}>
      {value}
    </span>
  );
}

export function ClassificationDemo({
  visual = false,
}: {
  visual?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduceMotion || paused) {
      return;
    }

    const timer = window.setInterval(() => {
      setStage((current) => (current + 1) % STAGES.length);
    }, 2800);

    return () => window.clearInterval(timer);
  }, [paused, reduceMotion]);

  const active = STAGES[stage];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[28px] border shadow-[0_16px_48px_rgb(30_77_64/0.08)]",
        visual
          ? "border-white/15 bg-[#070b12]/78 backdrop-blur-xl"
          : "border-border bg-surface",
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex flex-wrap items-center gap-1 border-b border-border px-3 py-2.5">
        {STAGES.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setStage(index)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              index === stage
                ? "bg-accent text-white"
                : "text-muted hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid min-h-[360px] lg:grid-cols-[1fr_1fr]">
        <div className="border-b border-border p-6 lg:border-r lg:border-b-0">
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted uppercase">
            Spreadsheet
          </p>
          <ul className="mt-5 space-y-4">
            {SAMPLE.raw.map((row, index) => (
              <motion.li
                key={row.column}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.35 }}
                className="flex items-baseline justify-between gap-4 border-b border-border pb-4 last:border-0"
              >
                <span className="font-mono text-[11px] text-muted">
                  {row.column}
                </span>
                <span className="text-right text-sm">{row.value}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="p-6">
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted uppercase">
            {active.label}
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="mt-5"
            >
              {active.id === "source" ? (
                visual ? (
                  <p className="font-mono text-sm text-muted">1 row → 1 product</p>
                ) : (
                  <p className="text-sm leading-7 text-muted">
                    One ingested item per row. Supplier labels stay raw until
                    interpretation — Comersly does not copy{" "}
                    <span className="text-foreground">E1_Brand</span> into
                    the delivery brand column.
                  </p>
                )
              ) : null}

              {active.id === "interpret" ? (
                <ul className="space-y-4">
                  {SAMPLE.interpreted.map((item) => (
                    <li key={item.field} className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{item.value}</p>
                        <p className="mt-0.5 font-mono text-[11px] text-muted">
                          {item.field} ← {item.sourceColumn}
                        </p>
                      </div>
                      <Confidence value={item.confidence} />
                    </li>
                  ))}
                </ul>
              ) : null}

              {active.id === "verify" ? (
                <div className="space-y-3 text-sm">
                  <p className="font-medium">{SAMPLE.evidence.productName}</p>
                  <p className="text-muted">
                    {SAMPLE.evidence.manufacturerName} · {SAMPLE.evidence.brandName}
                  </p>
                  <p className="font-mono text-[11px] text-brass">
                    {SAMPLE.evidence.url}
                  </p>
                  {visual ? null : (
                    <p className="leading-6 text-muted">
                      Manufacturer evidence is pulled from a discovered source page,
                      then held separately from the spreadsheet so classification
                      can cite it.
                    </p>
                  )}
                </div>
              ) : null}

              {active.id === "classify" ? (
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-surface-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/products/product-qo120.png"
                        alt="QO120 circuit breaker"
                        className="h-full w-full object-contain p-1.5"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{SAMPLE.evidence.productName}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {SAMPLE.evidence.brandName} · QO120
                      </p>
                    </div>
                  </div>
                  <dl className="grid grid-cols-3 gap-3">
                    <div>
                      <dt className="text-[11px] tracking-wide text-muted uppercase">
                        Dept
                      </dt>
                      <dd className="font-display mt-1 text-lg leading-tight">
                        {SAMPLE.classification.dept}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] tracking-wide text-muted uppercase">
                        Class
                      </dt>
                      <dd className="font-display mt-1 text-lg leading-tight">
                        {SAMPLE.classification.class}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] tracking-wide text-muted uppercase">
                        Fine
                      </dt>
                      <dd className="font-display mt-1 text-lg leading-tight">
                        {SAMPLE.classification.fine}
                      </dd>
                    </div>
                  </dl>
                  <div className="rounded-2xl border border-border bg-surface-muted px-4 py-3">
                    <p className="text-[11px] tracking-wide text-muted uppercase">
                      Classpath
                    </p>
                    <p className="mt-1 text-sm leading-6">
                      {SAMPLE.classification.classpath}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                    <Confidence value={SAMPLE.classification.confidence} />
                    <span className="font-mono text-[11px] text-muted">
                      needsReview: {String(SAMPLE.classification.needsReview)}
                    </span>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
