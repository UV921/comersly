"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { ProductImage } from "@/components/workspace/product-image";
import { cn } from "@/lib/cn";

export const ease = [0.22, 1, 0.36, 1] as const;
export const QO120 = "/products/product-qo120.png";
export const AFCI = "/products/product-afci.png";

export function useCycle(length: number, ms: number, paused = false) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) {
      setIndex(Math.max(length - 1, 0));
      return;
    }
    if (paused || length < 2) {
      return;
    }
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % length);
    }, ms);
    return () => window.clearInterval(timer);
  }, [length, ms, paused, reduce]);

  return { index, setIndex, reduce };
}

export function ProductShot({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl bg-canvas shadow-[0_10px_28px_rgb(30_77_64/0.08)] ring-1 ring-black/5",
        className,
      )}
    >
      <ProductImage src={src} alt={alt} className="h-full w-full" imgClassName="object-contain p-3" />
    </div>
  );
}

const SHEET = {
  headers: ["Mfg_Part", "E1_Brand", "Part_Manuf"],
  rows: [
    ["QO120", "SQD", "SQUARE D"],
    ["QO115", "???", "SCHNEIDR"],
  ],
};

export function SheetTable({
  active,
  messy = false,
}: {
  active?: { row: number; col: number } | null;
  messy?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-surface ring-1 ring-border">
      <div className="flex h-7 items-center gap-1.5 bg-surface-muted px-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-failed" />
        <span className="h-1.5 w-1.5 rounded-full bg-review" />
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <span className="ml-1 truncate font-mono text-[9px] text-muted">schneider-qo.xlsx</span>
      </div>
      <table className="w-full border-collapse text-left font-mono text-[10px]">
        <thead>
          <tr className="bg-canvas">
            {SHEET.headers.map((header) => (
              <th key={header} className="px-2 py-1.5 font-medium text-muted">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SHEET.rows.map((row, r) => (
            <tr key={row[0]}>
              {row.map((cell, c) => {
                const on = active?.row === r && active?.col === c;
                const warn = messy && (cell === "SQD" || cell === "???");
                return (
                  <td key={`${r}-${c}`} className="p-0">
                    <span
                      className={cn(
                        "block px-2 py-1.5 transition-colors duration-300",
                        on && "bg-accent-soft text-accent",
                        warn && !on && "text-failed",
                      )}
                    >
                      {cell}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PathChips({ filled }: { filled: boolean }) {
  const crumbs = filled
    ? ["Electrical", "Circuit Protection", "MCB"]
    : ["Dept", "Class", "Fine"];

  return (
    <div className="flex flex-wrap items-center gap-1">
      {crumbs.map((crumb, i) => (
        <span key={`${crumb}-${i}`} className="flex items-center gap-1">
          {i > 0 ? <span className="text-[10px] text-muted">/</span> : null}
          <motion.span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px]",
              filled ? "bg-accent-soft text-accent" : "bg-surface-muted text-muted",
            )}
            initial={false}
            animate={{ opacity: filled ? 1 : 0.55 }}
            transition={{ delay: filled ? i * 0.12 : 0, duration: 0.35, ease }}
          >
            {crumb}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

export function DropZone({ landed }: { landed: boolean }) {
  return (
    <div className="relative flex h-full items-center justify-center px-4">
      <div
        className={cn(
          "w-full max-w-[220px] rounded-2xl border border-dashed px-4 py-8 text-center transition-colors duration-500",
          landed ? "border-accent bg-accent-soft" : "border-border bg-canvas",
        )}
      >
        <p className="text-xs font-medium text-accent">Spreadsheet</p>
        <p className="mt-1 text-sm font-semibold tracking-tight">Drop CSV or XLSX</p>
      </div>
      <motion.div
        className="absolute left-1/2 w-48 -translate-x-1/2 rounded-xl bg-surface px-3 py-2 shadow-[0_8px_20px_rgb(30_77_64/0.1)] ring-1 ring-border"
        initial={false}
        animate={{ top: landed ? "46%" : "10%", scale: landed ? 1 : 0.96 }}
        transition={{ duration: 0.7, ease }}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-[10px] font-medium text-accent">
            XLSX
          </span>
          <span className="min-w-0">
            <span className="block truncate text-xs font-medium">schneider-qo.xlsx</span>
            <span className="block text-[10px] text-muted">48 rows · 212 KB</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export function FilePair({ active }: { active: "csv" | "xlsx" | null }) {
  return (
    <div className="flex h-full items-center justify-center gap-3 px-4">
      {(
        [
          ["csv", "CSV", "delivery.csv"],
          ["xlsx", "XLSX", "delivery.xlsx"],
        ] as const
      ).map(([id, kind, name]) => (
        <motion.div
          key={id}
          className="w-28 rounded-2xl bg-canvas p-3 ring-1 ring-border"
          animate={{
            y: active === id ? -4 : 0,
            boxShadow:
              active === id
                ? "0 12px 24px rgb(30 77 64 / 0.12)"
                : "0 0 0 rgb(30 77 64 / 0)",
          }}
          transition={{ duration: 0.45, ease }}
        >
          <div
            className={cn(
              "flex h-16 items-center justify-center rounded-xl text-xs font-medium",
              id === "csv" ? "bg-accent text-white" : "bg-surface text-accent ring-1 ring-border",
            )}
          >
            {kind}
          </div>
          <p className="mt-2 truncate text-[10px] text-muted">{name}</p>
        </motion.div>
      ))}
    </div>
  );
}

export function CatalogCard({
  src,
  name,
  meta,
}: {
  src: string;
  name: string;
  meta: string;
}) {
  return (
    <div className="w-40 rounded-[22px] bg-surface p-3 ring-1 ring-black/5">
      <ProductShot src={src} alt={name} className="aspect-square" />
      <p className="mt-2 truncate text-xs font-medium">{name}</p>
      <p className="truncate text-[11px] text-muted">{meta}</p>
    </div>
  );
}
