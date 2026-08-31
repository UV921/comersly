"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { SAMPLE_PRODUCTS } from "@/components/landing/sample-catalog";
import {
  DropZone,
  FilePair,
  IMPORT_MESSY,
  ProductShot,
  SheetTable,
  ease,
  useCycle,
} from "@/components/landing/landing-visuals";
import { cn } from "@/lib/cn";

const STEPS = [
  {
    id: "upload",
    label: "Upload",
    title: "You drop the messy spreadsheet.",
    body: "CSV or XLSX — the file a supplier actually sends. Nothing is cleaned yet.",
  },
  {
    id: "file",
    label: "Messy file",
    title: "Every row is abbreviated, incomplete, or wrong.",
    body: "SQD, ???, SCHNEIDR. No photos. No Dept, Class, or Fine. This cannot go on a storefront.",
  },
  {
    id: "interpret",
    label: "Interpret",
    title: "Comersly reads every row, not one product.",
    body: "Raw cells stay in the file. Catalog fields are written beside them — Square D, Schneider Electric, Siemens.",
  },
  {
    id: "classify",
    label: "Classify",
    title: "Each row gets a storefront path.",
    body: "Dept, Class, Fine, and Classpath are filled for the whole import, with a confidence score.",
  },
  {
    id: "catalog",
    label: "Catalog",
    title: "The sheet is now a set of products.",
    body: "Names, brands, photos, and paths — ready to review as a catalog, not as columns.",
  },
  {
    id: "export",
    label: "Export",
    title: "You download a commerce-ready file.",
    body: "CSV or XLSX for PIM or the storefront. The original spreadsheet is untouched.",
  },
] as const;

function UploadStage({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const [landed, setLanded] = useState(Boolean(reduce) || !active);

  useEffect(() => {
    if (reduce || !active) {
      setLanded(Boolean(reduce) || !active);
      return;
    }
    setLanded(false);
    const timer = window.setTimeout(() => setLanded(true), 400);
    return () => window.clearTimeout(timer);
  }, [active, reduce]);

  return (
    <div className="flex h-full min-h-[240px] items-center justify-center">
      <div className="h-56 w-full max-w-sm">
        <DropZone landed={landed} />
      </div>
    </div>
  );
}

function CatalogStage() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {SAMPLE_PRODUCTS.map((product, i) => {
        const name = product.productName ?? product.rawMpn ?? "Product";
        return (
          <motion.li
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08, ease }}
          >
            <div className="rounded-2xl bg-canvas p-2.5 ring-1 ring-border">
              <ProductShot
                src={product.imageUrl ?? ""}
                alt={name}
                className="aspect-square shadow-none"
              />
              <p className="mt-2 truncate text-xs font-medium">{name}</p>
              <p className="truncate text-[10px] text-muted">{product.brand}</p>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}

function ExportStage() {
  return (
    <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-5">
      <p className="text-sm font-medium">48 products ready to deliver</p>
      <div className="h-40 w-full max-w-md">
        <FilePair active="xlsx" />
      </div>
      <p className="text-xs text-muted">delivery.xlsx · commerce-ready export</p>
    </div>
  );
}

export function HeroStory() {
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const { index, setIndex } = useCycle(STEPS.length, 4000, paused);
  const step = STEPS[reduce ? STEPS.length - 1 : index] ?? STEPS[0];
  const [scanRow, setScanRow] = useState(0);

  useEffect(() => {
    if (reduce || paused) {
      return;
    }
    if (step.id !== "file" && step.id !== "interpret" && step.id !== "classify") {
      return;
    }
    const timer = window.setInterval(() => {
      setScanRow((current) => (current + 1) % IMPORT_MESSY.length);
    }, 700);
    return () => window.clearInterval(timer);
  }, [paused, reduce, step.id]);

  return (
    <div className="overflow-hidden rounded-[28px] bg-surface ring-1 ring-border">
      <div className="flex gap-1 overflow-x-auto px-4 pt-4">
        {STEPS.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setPaused(true);
              setIndex(i);
            }}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              i === (reduce ? STEPS.length - 1 : index)
                ? "bg-accent text-accent-foreground"
                : "text-muted hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mx-4 mt-3 hidden h-1 overflow-hidden rounded-full bg-border sm:block">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={false}
          animate={{ width: `${((index + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.45, ease }}
        />
      </div>

      <div className="min-h-[280px] px-4 py-5 sm:min-h-[300px] sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.35, ease }}
          >
            {step.id === "upload" ? <UploadStage active={step.id === "upload"} /> : null}
            {step.id === "file" ? (
              <SheetTable mode="messy" full activeRow={reduce ? 0 : scanRow} />
            ) : null}
            {step.id === "interpret" ? (
              <SheetTable mode="clean" full activeRow={reduce ? 1 : scanRow} />
            ) : null}
            {step.id === "classify" ? (
              <SheetTable mode="classify" full activeRow={reduce ? 0 : scanRow} />
            ) : null}
            {step.id === "catalog" ? <CatalogStage /> : null}
            {step.id === "export" ? <ExportStage /> : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="border-t border-border px-5 py-4 sm:px-6">
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
