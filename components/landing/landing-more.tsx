"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { SAMPLE_PRODUCTS } from "@/components/landing/sample-catalog";
import {
  AFCI,
  DropZone,
  FilePair,
  PathChips,
  ProductShot,
  QO120,
  SheetTable,
  ease,
  useCycle,
} from "@/components/landing/landing-visuals";
import { ConfidenceBadge, NeedsReviewBadge } from "@/components/workspace/status-badge";
import { PRODUCT_DELIVERY_HEADERS } from "@/server/services/product-delivery/headers";

function MessyGrid() {
  const { index, reduce } = useCycle(6, 1100);
  const spots = [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 1, col: 2 },
  ];
  const active = reduce ? { row: 0, col: 1 } : (spots[index] ?? spots[0]);

  return (
    <div className="flex h-full items-center p-1">
      <SheetTable active={active} messy />
    </div>
  );
}

function MissingPhoto() {
  const { index, reduce } = useCycle(2, 3200);
  const show = reduce || index === 1;

  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-[7.5rem] w-[7.5rem] overflow-hidden rounded-2xl bg-canvas ring-1 ring-black/5">
        <AnimatePresence mode="wait">
          {show ? (
            <motion.div
              key="photo"
              className="h-full w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease }}
            >
              <ProductShot src={QO120} alt="QO120" className="h-full w-full shadow-none ring-0" />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="flex h-full w-full items-center justify-center bg-surface-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease }}
            >
              <span className="text-2xl font-bold text-accent/25">C</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TaxonomyGap() {
  const { index, reduce } = useCycle(2, 3200);
  const on = reduce || index === 1;

  return (
    <div className="flex h-full items-center gap-3 px-2">
      <ProductShot src={QO120} alt="" className="h-[4.5rem] w-[4.5rem] shrink-0" />
      <PathChips filled={on} />
    </div>
  );
}

export function ProblemScenes() {
  const reduce = useReducedMotion();
  const cards = [
    { label: "Columns", visual: <MessyGrid /> },
    { label: "Photo", visual: <MissingPhoto /> },
    { label: "Path", visual: <TaxonomyGap /> },
  ];

  return (
    <ul className="mt-6 grid gap-4 md:grid-cols-3">
      {cards.map((card, i) => (
        <motion.li
          key={card.label}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: i * 0.08, ease }}
          className="overflow-hidden rounded-[28px] bg-surface ring-1 ring-black/5"
        >
          <div className="h-44 p-3">{card.visual}</div>
          <p className="px-4 pb-2.5 text-[11px] text-muted">{card.label}</p>
        </motion.li>
      ))}
    </ul>
  );
}

export function KeepVsWrite() {
  const reduce = useReducedMotion();
  const { index } = useCycle(3, 2800);
  const maps = [
    { raw: "E1_Brand", value: "SQD", out: "Square D" },
    { raw: "Part_Manuf", value: "SQUARE D", out: "Schneider Electric" },
    { raw: "Mfg_Part_Num", value: "QO120", out: "QO120" },
  ] as const;
  const row = maps[index] ?? maps[0];

  return (
    <section id="interpret" className="scroll-mt-24 px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-[10px] font-medium tracking-[0.18em] text-accent uppercase">Interpret</p>
        <h2 className="mt-1.5 text-xl font-semibold tracking-tight">SQD becomes Square D.</h2>
        <p className="mt-1.5 text-sm text-muted">Headers stay. We write the catalog field.</p>

        <div className="mt-6 overflow-hidden rounded-[28px] bg-surface p-4 sm:p-6">
          <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
            <div className="rounded-2xl bg-canvas p-4 ring-1 ring-border">
              <p className="font-mono text-[10px] text-muted">{row.raw}</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={row.value}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.35, ease }}
                  className="mt-2 text-lg font-semibold tracking-tight"
                >
                  {row.value}
                </motion.p>
              </AnimatePresence>
            </div>
            <span className="hidden text-muted sm:block" aria-hidden>
              →
            </span>
            <div className="rounded-2xl bg-accent-soft p-4">
              <p className="text-[10px] font-medium tracking-[0.14em] text-accent uppercase">
                brand
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={row.out}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.35, ease }}
                  className="mt-2 text-lg font-semibold tracking-tight text-accent"
                >
                  {row.out}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <ProductShot src={QO120} alt="QO120" className="h-16 w-16" />
            <div>
              <p className="text-sm font-medium">QO 20A 1-pole circuit breaker</p>
              <p className="text-xs text-muted">Square D · QO120</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function EvidenceSection() {
  const reduce = useReducedMotion();
  const { index } = useCycle(2, 3000);
  const checking = !reduce && index === 0;

  return (
    <section id="evidence" className="scroll-mt-24 px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-[10px] font-medium tracking-[0.18em] text-accent uppercase">Verify</p>
        <h2 className="mt-1.5 text-xl font-semibold tracking-tight">Checked on the manufacturer page.</h2>
        <p className="mt-1.5 text-sm text-muted">Evidence first. Then classify.</p>

        <motion.div
          className="mx-auto mt-6 max-w-lg overflow-hidden rounded-[28px] bg-surface ring-1 ring-black/5"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="flex h-9 items-center gap-1.5 bg-surface-muted px-3">
            <span className="h-2 w-2 rounded-full bg-failed" />
            <span className="h-2 w-2 rounded-full bg-review" />
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="ml-2 truncate font-mono text-[10px] text-muted">
              se.com/us/en/product/QO120
            </span>
          </div>
          <div className="grid items-center gap-5 p-5 sm:grid-cols-[8rem_1fr]">
            <ProductShot src={QO120} alt="QO120 circuit breaker" className="aspect-square" />
            <div>
              <p className="text-xs font-medium text-accent">Square D</p>
              <p className="mt-1 text-sm font-semibold tracking-tight">
                QO 20A 1-pole circuit breaker
              </p>
              <p className="mt-1 text-xs text-muted">Schneider Electric · QO120</p>
              <motion.div
                className="mt-3"
                animate={{ opacity: checking ? 0.35 : 1 }}
                transition={{ duration: 0.45 }}
              >
                <ConfidenceBadge confidence="HIGH" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function ReviewSection() {
  const reduce = useReducedMotion();
  const { index } = useCycle(2, 3200);
  const review = !reduce && index === 1;

  return (
    <section id="review" className="scroll-mt-24 px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-[10px] font-medium tracking-[0.18em] text-accent uppercase">Review</p>
        <h2 className="mt-1.5 text-xl font-semibold tracking-tight">HIGH ships. MEDIUM waits.</h2>
        <p className="mt-1.5 text-sm text-muted">A person only touches the pause pile.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <motion.article
            className="rounded-[28px] bg-surface p-4 ring-1 ring-black/5"
            animate={reduce ? undefined : { opacity: review ? 0.55 : 1 }}
            transition={{ duration: 0.5, ease }}
          >
            <ProductShot src={QO120} alt="QO120" className="mx-auto aspect-square max-w-[10rem]" />
            <p className="mt-3 text-sm font-medium">QO 20A 1-pole</p>
            <p className="text-xs text-muted">Square D · QO120</p>
            <div className="mt-2">
              <ConfidenceBadge confidence="HIGH" />
            </div>
          </motion.article>

          <motion.article
            className="rounded-[28px] bg-surface p-4 ring-1 ring-black/5"
            animate={reduce ? undefined : { y: review ? -6 : 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <ProductShot src={AFCI} alt="AFCI breaker" className="mx-auto aspect-square max-w-[10rem]" />
            <p className="mt-3 text-sm font-medium">QO 20A combination AFCI</p>
            <p className="text-xs text-muted">Square D · QO120CAFIC</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <ConfidenceBadge confidence="MEDIUM" />
              <NeedsReviewBadge />
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}

const EXPORT_CELLS = PRODUCT_DELIVERY_HEADERS.slice(0, 24);

export function ExportGrid() {
  const reduce = useReducedMotion();
  const [filled, setFilled] = useState(reduce ? EXPORT_CELLS.length : 0);

  useEffect(() => {
    if (reduce) {
      return;
    }
    const timer = window.setInterval(() => {
      setFilled((current) => (current >= EXPORT_CELLS.length ? 0 : current + 1));
    }, 140);
    return () => window.clearInterval(timer);
  }, [reduce]);

  return (
    <div className="mt-6 overflow-hidden rounded-[28px] bg-surface p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <motion.span
          className="inline-flex h-10 items-center rounded-full bg-accent px-5 text-sm font-medium text-white"
          animate={{ opacity: filled > 8 ? 1 : 0.4 }}
        >
          CSV
        </motion.span>
        <motion.span
          className="inline-flex h-10 items-center rounded-full bg-canvas px-5 text-sm font-medium ring-1 ring-border"
          animate={{ opacity: filled > 16 ? 1 : 0.4 }}
        >
          XLSX
        </motion.span>
      </div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {EXPORT_CELLS.map((header, i) => {
          const on = i < filled;
          return (
            <li
              key={header}
              className={`truncate rounded-xl px-3 py-2 font-mono text-[11px] transition-colors duration-300 ${
                on ? "bg-accent-soft text-accent" : "bg-surface-muted text-muted"
              }`}
            >
              {header}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function WhoSection() {
  const reduce = useReducedMotion();
  const { index } = useCycle(2, 2800);
  const landed = reduce || index === 1;
  const file = reduce ? "xlsx" : index === 0 ? "csv" : "xlsx";
  const shots = SAMPLE_PRODUCTS.slice(0, 3);

  return (
    <section id="who" className="scroll-mt-24 px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-[10px] font-medium tracking-[0.18em] text-accent uppercase">Who</p>
        <h2 className="mt-1.5 text-xl font-semibold tracking-tight">File in. Catalog out.</h2>
        <p className="mt-1.5 text-sm text-muted">Distributors, catalog teams, PIM.</p>

        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          <motion.li
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="rounded-[28px] bg-surface p-3"
          >
            <div className="h-36">
              <DropZone landed={landed} />
            </div>
            <p className="mt-1 text-center text-[11px] text-muted">Drop</p>
          </motion.li>
          <motion.li
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08, ease }}
            className="rounded-[28px] bg-surface p-5"
          >
            <div className="grid grid-cols-3 gap-2">
              {shots.map((product) => (
                <ProductShot
                  key={product.id}
                  src={product.imageUrl ?? QO120}
                  alt={product.productName ?? "Product"}
                  className="aspect-square"
                />
              ))}
            </div>
            <p className="mt-2 text-center text-[11px] text-muted">Catalog</p>
          </motion.li>
          <motion.li
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16, ease }}
            className="rounded-[28px] bg-surface p-3"
          >
            <div className="h-36">
              <FilePair active={file} />
            </div>
            <p className="mt-1 text-center text-[11px] text-muted">Export</p>
          </motion.li>
        </ul>
      </div>
    </section>
  );
}

export function CloseCta({ href, label }: { href: string; label: string }) {
  const reduce = useReducedMotion();

  return (
    <section className="px-5 py-16 sm:px-8">
      <motion.div
        className="mx-auto flex max-w-3xl flex-col items-center rounded-[32px] bg-accent px-8 py-10 text-white"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
      >
        <ProductShot src={QO120} alt="" className="mb-6 h-16 w-16 ring-white/20" />
        <a
          href={href}
          className="inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-medium text-accent hover:bg-white/90"
        >
          {label}
        </a>
      </motion.div>
    </section>
  );
}
