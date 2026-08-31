"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { SAMPLE_PRODUCTS } from "@/components/landing/sample-catalog";
import {
  CatalogCard,
  DropZone,
  FilePair,
  PathChips,
  ProductShot,
  QO120,
  SheetTable,
  ease,
  useCycle,
} from "@/components/landing/landing-visuals";
import { ConfidenceBadge } from "@/components/workspace/status-badge";
import { cn } from "@/lib/cn";

const HOW = [
  {
    id: "upload",
    label: "Upload",
    title: "Drop the supplier file.",
    body: "CSV or XLSX. The original sheet is stored as-is — Comersly never overwrites it.",
  },
  {
    id: "interpret",
    label: "Interpret",
    title: "SQD becomes Square D.",
    body: "Each messy cell is mapped to a catalog field. The supplier column stays in the file.",
  },
  {
    id: "verify",
    label: "Verify",
    title: "The manufacturer page is the source of truth.",
    body: "Brand, name, and photo come from evidence — not from guessing the spreadsheet.",
  },
  {
    id: "classify",
    label: "Classify",
    title: "Dept, Class, Fine, and Classpath.",
    body: "One row becomes a storefront path, with a confidence score attached.",
  },
  {
    id: "catalog",
    label: "Catalog",
    title: "The row is now a product.",
    body: "Open it like a record: photo, identity, path, and copy in one place.",
  },
  {
    id: "export",
    label: "Export",
    title: "Download the delivery file.",
    body: "CSV or XLSX with classified columns. The upload stays the upload.",
  },
] as const;

function TimedDrop() {
  const reduce = useReducedMotion();
  const [landed, setLanded] = useState(Boolean(reduce));

  useEffect(() => {
    if (reduce) {
      return;
    }
    const timer = window.setTimeout(() => setLanded(true), 280);
    return () => window.clearTimeout(timer);
  }, [reduce]);

  return <DropZone landed={landed} />;
}

function HowVisual({ id }: { id: (typeof HOW)[number]["id"] }) {
  if (id === "upload") {
    return <TimedDrop />;
  }

  if (id === "interpret") {
    return (
      <div className="flex h-full items-center justify-center gap-3 px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="rounded-2xl bg-canvas px-4 py-3 ring-1 ring-border"
        >
          <p className="font-mono text-[10px] text-muted">E1_Brand</p>
          <p className="mt-1 text-sm font-semibold">SQD</p>
        </motion.div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="text-muted"
          aria-hidden
        >
          →
        </motion.span>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease }}
          className="rounded-2xl bg-accent-soft px-4 py-3"
        >
          <p className="text-[10px] font-medium text-accent">brand</p>
          <p className="mt-1 text-sm font-semibold text-accent">Square D</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.4, ease }}
          className="hidden sm:block"
        >
          <ProductShot src={QO120} alt="QO120" className="h-16 w-16" />
        </motion.div>
      </div>
    );
  }

  if (id === "verify") {
    return (
      <div className="flex h-full items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
          className="flex w-full max-w-md items-center gap-4 overflow-hidden rounded-2xl bg-canvas ring-1 ring-border"
        >
          <div className="w-28 shrink-0">
            <ProductShot src={QO120} alt="QO120" className="aspect-square rounded-none shadow-none ring-0" />
          </div>
          <div className="min-w-0 py-3 pr-3">
            <p className="truncate font-mono text-[10px] text-muted">se.com/product/QO120</p>
            <p className="mt-1 truncate text-sm font-medium">QO 20A 1-pole</p>
            <p className="mt-0.5 text-xs text-muted">Schneider Electric · Square D</p>
            <div className="mt-2">
              <ConfidenceBadge confidence="HIGH" />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (id === "classify") {
    return (
      <div className="flex h-full items-center justify-center gap-4 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease }}
        >
          <ProductShot src={QO120} alt="QO120" className="h-20 w-20" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.4, ease }}
        >
          <p className="text-sm font-medium">QO 20A 1-pole circuit breaker</p>
          <p className="mt-1 text-xs text-muted">From evidence, not the supplier label</p>
          <div className="mt-3">
            <PathChips filled />
          </div>
        </motion.div>
      </div>
    );
  }

  if (id === "catalog") {
    return (
      <div className="flex h-full items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
        >
          <CatalogCard src={QO120} name="QO 20A 1-pole" meta="Square D · QO120" />
        </motion.div>
      </div>
    );
  }

  return <FilePair active="xlsx" />;
}

export function HowScene() {
  const [paused, setPaused] = useState(false);
  const { index, setIndex, reduce } = useCycle(HOW.length, 4500, paused);
  const step = HOW[index] ?? HOW[0];

  return (
    <div className="overflow-hidden rounded-[28px] bg-surface ring-1 ring-border">
      <div className="flex gap-1 overflow-x-auto px-3 py-3">
        {HOW.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setPaused(true);
              setIndex(i);
            }}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              i === index ? "bg-accent text-accent-foreground" : "text-muted hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mx-8 hidden h-1 overflow-hidden rounded-full bg-border sm:block">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={false}
          animate={{ width: `${((index + 1) / HOW.length) * 100}%` }}
          transition={{ duration: 0.55, ease }}
        />
      </div>
      <div className="h-56 sm:h-60">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className="h-full"
          >
            <HowVisual id={step.id} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="border-t border-border px-5 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <p className="text-sm font-medium">{step.title}</p>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">{step.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ClassifyScene() {
  const stages = [
    {
      id: "source",
      label: "Row",
      title: "The spreadsheet has a part number — not a product.",
      body: "QO120 and SQD. No photo. No Dept, Class, or Fine. A storefront cannot use this row.",
    },
    {
      id: "evidence",
      label: "Evidence",
      title: "The manufacturer page names the part and supplies the photo.",
      body: "Square D QO 20A 1-pole, confirmed on se.com — before any path is written.",
    },
    {
      id: "path",
      label: "Path",
      title: "Then Dept, Class, and Fine can be filled.",
      body: "Electrical / Circuit Protection / MCB, with a confidence score so only uncertain rows wait for review.",
    },
  ] as const;
  const [paused, setPaused] = useState(false);
  const { index, setIndex, reduce } = useCycle(stages.length, 4200, paused);
  const stage = stages[index] ?? stages[0];

  return (
    <div className="overflow-hidden rounded-[28px] bg-surface ring-1 ring-border">
      <div className="flex flex-wrap gap-1 px-3 py-3">
        {stages.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setPaused(true);
              setIndex(i);
            }}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium",
              i === index ? "bg-accent text-accent-foreground" : "text-muted hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid min-h-[300px] lg:grid-cols-2">
        <div className="flex items-center border-b border-border p-5 lg:border-r lg:border-b-0">
          <SheetTable
            mode={stage.id === "source" ? "messy" : "clean"}
            full
            activeRow={0}
          />
        </div>
        <div className="p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage.id}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.35, ease }}
              className="flex h-full min-h-[240px] flex-col justify-center"
            >
              {stage.id === "source" ? (
                <div className="flex items-center gap-4">
                  <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-2xl bg-product-well ring-1 ring-border">
                    <span className="text-2xl font-bold text-accent/20">C</span>
                    <span className="mt-1 text-[10px] text-muted">No image</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Row 1 — not a product yet</p>
                    <p className="mt-1 font-mono text-xs text-failed">QO120 · SQD</p>
                    <p className="mt-2 text-xs text-muted">Dept, Class, Fine empty</p>
                    <div className="mt-3">
                      <PathChips filled={false} />
                    </div>
                  </div>
                </div>
              ) : null}
              {stage.id === "evidence" ? (
                <div className="flex items-center gap-4">
                  <ProductShot src={QO120} alt="QO120" className="h-28 w-28 shrink-0" />
                  <div>
                    <p className="font-mono text-[10px] text-muted">se.com/product/QO120</p>
                    <p className="mt-1 text-sm font-medium">QO 20A 1-pole circuit breaker</p>
                    <p className="mt-0.5 text-xs text-muted">Schneider Electric · Square D</p>
                    <div className="mt-3">
                      <ConfidenceBadge confidence="HIGH" />
                    </div>
                  </div>
                </div>
              ) : null}
              {stage.id === "path" ? (
                <div className="flex items-center gap-4">
                  <ProductShot src={QO120} alt="QO120" className="h-28 w-28 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">QO 20A 1-pole circuit breaker</p>
                    <p className="mt-0.5 text-xs text-muted">Square D · QO120</p>
                    <div className="mt-3">
                      <PathChips filled />
                    </div>
                    <p className="mt-3 text-[11px] text-accent">
                      Electrical &gt; Circuit Protection &gt; Miniature Circuit Breakers
                    </p>
                    <div className="mt-2">
                      <ConfidenceBadge confidence="HIGH" />
                    </div>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="border-t border-border px-5 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <p className="text-sm font-medium">{stage.title}</p>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">{stage.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function CatalogShowcase() {
  const { index, reduce } = useCycle(SAMPLE_PRODUCTS.length, 3200);
  const featured = SAMPLE_PRODUCTS[index] ?? SAMPLE_PRODUCTS[0];
  const featuredName = featured.productName ?? featured.rawMpn ?? "Product";
  const featuredPath = featured.verifiedClasspath ?? featured.proposedClasspath;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <motion.article
        className="flex flex-col gap-5 rounded-[28px] bg-surface p-5 ring-1 ring-border sm:flex-row sm:items-center"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={featured.id}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="w-full sm:w-44"
          >
            <ProductShot
              src={featured.imageUrl ?? QO120}
              alt={featuredName}
              className="aspect-square shadow-none"
            />
          </motion.div>
        </AnimatePresence>
        <div className="min-w-0">
          <p className="text-[10px] font-medium tracking-[0.16em] text-accent uppercase">
            Product record
          </p>
          <p className="mt-1 text-lg font-semibold tracking-tight">{featuredName}</p>
          <p className="mt-1 text-sm text-muted">
            {featured.brand} · {featured.manufacturer} · {featured.rawMpn}
          </p>
          <p className="mt-3 text-sm text-accent">{featuredPath}</p>
          <p className="mt-4 text-xs leading-5 text-muted">
            This used to be a spreadsheet row. It is now a catalog item with a photo and a path.
          </p>
        </div>
      </motion.article>
      <ul className="flex flex-col gap-2">
        {SAMPLE_PRODUCTS.map((product, i) => {
          const name = product.productName ?? product.rawMpn ?? "Product";
          const active = index === i;
          return (
            <li
              key={product.id}
              className={cn(
                "flex items-center gap-3 rounded-2xl bg-surface px-3 py-2.5 ring-1 transition-colors",
                active ? "ring-accent" : "ring-border",
              )}
            >
              <ProductShot
                src={product.imageUrl ?? QO120}
                alt={name}
                className="h-14 w-14 shrink-0 shadow-none"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{name}</p>
                <p className="truncate text-[11px] text-muted">
                  {product.brand} · {product.rawMpn}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
