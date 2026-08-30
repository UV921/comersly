"use client";

import { animate, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useState } from "react";

import { SAMPLE_PRODUCTS } from "@/components/landing/sample-catalog";
import { BrandMark } from "@/components/brand-mark";
import { DashboardCharts } from "@/components/workspace/dashboard-charts";
import { ImportTable } from "@/components/workspace/import-table";
import { ProductStrip } from "@/components/workspace/product-table";
import {
  IconFileExport,
  IconFileImport,
  IconLayoutDashboard,
  IconPackage,
  IconUpload,
} from "@tabler/icons-react";
import type { ImportListItem } from "@/server/db/queries/workspace";

export const PREVIEW_WIDTH = 1000;
export const PREVIEW_HEIGHT = 560;

const NAV = [
  { label: "Dashboard", icon: IconLayoutDashboard, active: true },
  { label: "Catalog", icon: IconPackage, active: false },
  { label: "Imports", icon: IconFileImport, active: false },
  { label: "Upload", icon: IconUpload, active: false },
  { label: "Exports", icon: IconFileExport, active: false },
];

const IMPORTS: ImportListItem[] = [
  {
    id: "preview-1",
    fileName: "schneider-qo.xlsx",
    sourceFormat: "XLSX",
    status: "COMPLETED",
    totalRows: 48,
    successfulRows: 48,
    readyCount: 48,
    createdAt: new Date("2026-08-18T14:20:00"),
    exportable: true,
  },
  {
    id: "preview-2",
    fileName: "square-d-breakers.csv",
    sourceFormat: "CSV",
    status: "PROCESSING",
    totalRows: 36,
    successfulRows: 22,
    readyCount: 22,
    createdAt: new Date("2026-08-24T09:12:00"),
    exportable: false,
  },
  {
    id: "preview-3",
    fileName: "siemens-5sj.csv",
    sourceFormat: "CSV",
    status: "COMPLETED",
    totalRows: 36,
    successfulRows: 36,
    readyCount: 36,
    createdAt: new Date("2026-08-12T11:04:00"),
    exportable: true,
  },
];

function useReadyCount() {
  const reduce = useReducedMotion();
  const count = useMotionValue(47);
  const rounded = useTransform(count, (value) => Math.round(value));
  const [ready, setReady] = useState(47);

  useEffect(() => rounded.on("change", setReady), [rounded]);

  useEffect(() => {
    if (reduce) {
      count.set(47);
      return;
    }

    count.set(22);
    const controls = animate(count, 47, {
      duration: 5.5,
      ease: [0.45, 0, 0.55, 1],
      repeat: Infinity,
      repeatType: "mirror",
    });

    return () => controls.stop();
  }, [count, reduce]);

  return ready;
}

export function AppPreview() {
  const ready = useReadyCount();

  const imports = IMPORTS.map((item) =>
    item.id === "preview-2" ? { ...item, readyCount: Math.min(36, 12 + Math.floor(ready / 4)) } : item,
  );

  return (
    <div
      className="pointer-events-none flex bg-canvas"
      style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
    >
      <aside className="flex w-40 shrink-0 flex-col px-3 py-4">
        <BrandMark href="/" variant="workspace" />
        <nav className="mt-6 flex flex-col gap-0.5">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <span
                key={item.label}
                className={`flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm ${
                  item.active ? "bg-accent-soft font-medium text-accent" : "text-muted"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </span>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0 flex-1 overflow-hidden rounded-tl-[20px] bg-surface">
        <div className="flex h-12 items-center px-4">
          <div className="h-8 w-full max-w-xs rounded-full bg-surface-muted" />
        </div>
        <div className="px-4 pb-4">
          <p className="text-xl font-semibold tracking-tight">Dashboard</p>
          <div className="mt-3 grid grid-cols-[1.3fr_0.7fr] gap-3">
            <div className="rounded-[20px] bg-accent px-5 py-4 text-white">
              <p className="text-[10px] tracking-[0.18em] text-white/55 uppercase">Catalog</p>
              <p className="mt-2 text-4xl font-semibold tabular-nums">{ready}</p>
              <p className="mt-1 text-xs text-white/70">{ready} of 120 products ready</p>
            </div>
            <div className="flex flex-col justify-between rounded-[20px] bg-accent-soft px-4 py-4">
              <p className="text-[10px] tracking-[0.18em] text-accent uppercase">Review</p>
              <p className="text-3xl font-semibold text-accent">6</p>
              <p className="text-xs text-muted">needs a look</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-[minmax(0,1.3fr)_minmax(12rem,0.7fr)] items-start gap-3">
            <ImportTable title="Recent imports" imports={imports} framed={false} />
            <DashboardCharts
              imports={imports}
              pipeline={{
                total: 120,
                interpreted: Math.min(120, ready + 40),
                classified: Math.min(120, ready + 20),
                assets: Math.min(120, ready),
                enriched: Math.min(120, ready + 10),
                normalized: Math.min(120, ready + 8),
                content: ready,
              }}
            />
          </div>
          <div className="mt-3">
            <ProductStrip products={SAMPLE_PRODUCTS} interactive={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroDashboard() {
  return (
    <div
      className="@container relative w-full overflow-hidden rounded-[22px] bg-canvas shadow-[0_22px_56px_rgb(30_77_64/0.2)] ring-1 ring-black/5"
      style={{ aspectRatio: `${PREVIEW_WIDTH} / ${PREVIEW_HEIGHT}` }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left [transform:scale(calc(100cqw/1000))]"
        style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
      >
        <AppPreview />
      </div>
    </div>
  );
}
