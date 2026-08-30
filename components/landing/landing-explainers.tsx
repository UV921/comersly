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
  { id: "upload", label: "Upload" },
  { id: "interpret", label: "Interpret" },
  { id: "verify", label: "Verify" },
  { id: "classify", label: "Classify" },
  { id: "catalog", label: "Catalog" },
  { id: "export", label: "Export" },
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
        <div className="rounded-2xl bg-canvas px-4 py-3 ring-1 ring-border">
          <p className="font-mono text-[10px] text-muted">E1_Brand</p>
          <p className="mt-1 text-sm font-semibold">SQD</p>
        </div>
        <span className="text-muted" aria-hidden>
          →
        </span>
        <div className="rounded-2xl bg-accent-soft px-4 py-3">
          <p className="text-[10px] font-medium text-accent">brand</p>
          <p className="mt-1 text-sm font-semibold text-accent">Square D</p>
        </div>
        <ProductShot src={QO120} alt="QO120" className="hidden h-16 w-16 sm:block" />
      </div>
    );
  }

  if (id === "verify") {
    return (
      <div className="flex h-full items-center justify-center px-6">
        <div className="flex w-full max-w-md items-center gap-4 overflow-hidden rounded-2xl bg-canvas ring-1 ring-black/5">
          <div className="w-28 shrink-0">
            <ProductShot src={QO120} alt="QO120" className="aspect-square rounded-none shadow-none ring-0" />
          </div>
          <div className="min-w-0 py-3 pr-3">
            <p className="truncate font-mono text-[10px] text-muted">se.com/product/QO120</p>
            <p className="mt-1 truncate text-sm font-medium">QO 20A 1-pole</p>
            <div className="mt-2">
              <ConfidenceBadge confidence="HIGH" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (id === "classify") {
    return (
      <div className="flex h-full items-center justify-center gap-4 px-6">
        <ProductShot src={QO120} alt="QO120" className="h-20 w-20" />
        <PathChips filled />
      </div>
    );
  }

  if (id === "catalog") {
    return (
      <div className="flex h-full items-center justify-center">
        <CatalogCard src={QO120} name="QO 20A 1-pole" meta="Square D · QO120" />
      </div>
    );
  }

  return <FilePair active="xlsx" />;
}

export function HowScene() {
  const [paused, setPaused] = useState(false);
  const { index, setIndex, reduce } = useCycle(HOW.length, 3800, paused);
  const step = HOW[index] ?? HOW[0];

  return (
    <div className="overflow-hidden rounded-[28px] bg-surface ring-1 ring-black/5">
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
              i === index ? "bg-accent text-white" : "text-muted hover:text-foreground",
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
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className="h-full"
          >
            <HowVisual id={step.id} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ClassifyScene() {
  const stages = ["source", "interpret", "verify", "classify"] as const;
  const [paused, setPaused] = useState(false);
  const { index, setIndex, reduce } = useCycle(stages.length, 4000, paused);
  const stage = stages[index] ?? "source";

  return (
    <div className="overflow-hidden rounded-[28px] bg-surface ring-1 ring-black/5">
      <div className="flex flex-wrap gap-1 px-3 py-3">
        {[
          ["source", "Source"],
          ["interpret", "Interpret"],
          ["verify", "Verify"],
          ["classify", "Classify"],
        ].map(([id, label], i) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setPaused(true);
              setIndex(i);
            }}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium",
              i === index ? "bg-accent text-white" : "text-muted hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid min-h-[280px] lg:grid-cols-2">
        <div className="flex items-center border-b border-border p-4 lg:border-r lg:border-b-0">
          <SheetTable
            messy={stage === "source"}
            active={stage === "source" ? { row: 0, col: 1 } : { row: 0, col: 0 }}
          />
        </div>
        <div className="p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.35, ease }}
              className="flex h-full min-h-[240px] items-center justify-center"
            >
              {stage === "source" ? (
                <div className="flex items-center gap-4">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-surface-muted ring-1 ring-border">
                    <span className="text-2xl font-bold text-accent/20">C</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted">Row 1</p>
                    <p className="mt-1 font-mono text-xs">QO120 · SQD</p>
                  </div>
                </div>
              ) : null}
              {stage === "interpret" ? <HowVisual id="interpret" /> : null}
              {stage === "verify" ? <HowVisual id="verify" /> : null}
              {stage === "classify" ? (
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <ProductShot src={QO120} alt="QO120" className="h-24 w-24" />
                  <div>
                    <p className="text-sm font-medium">QO 20A 1-pole circuit breaker</p>
                    <p className="mt-1 text-xs text-muted">Square D · QO120</p>
                    <div className="mt-3">
                      <PathChips filled />
                    </div>
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

export function CatalogShowcase() {
  const { index, reduce } = useCycle(SAMPLE_PRODUCTS.length, 3200);

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {SAMPLE_PRODUCTS.map((product, i) => {
        const name = product.productName ?? product.rawMpn ?? "Product";
        const active = index === i;

        return (
          <motion.li
            key={product.id}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease }}
          >
            <motion.div
              className="rounded-[22px] bg-surface p-3 ring-1 ring-black/5"
              animate={
                reduce
                  ? undefined
                  : {
                      y: active ? -4 : 0,
                      boxShadow: active
                        ? "0 14px 32px rgb(30 77 64 / 0.12)"
                        : "0 0 0 rgb(30 77 64 / 0)",
                    }
              }
              transition={{ duration: 0.55, ease }}
            >
              <ProductShot
                src={product.imageUrl ?? QO120}
                alt={name}
                className="aspect-square shadow-none ring-0"
              />
              <p className="mt-3 truncate text-sm font-medium">{name}</p>
              <p className="truncate text-xs text-muted">{product.brand ?? product.rawMpn}</p>
              <p className="mt-2 truncate text-[11px] text-accent">
                {product.verifiedClasspath ?? product.proposedClasspath}
              </p>
            </motion.div>
          </motion.li>
        );
      })}
    </ul>
  );
}
