"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { SAMPLE_PRODUCTS } from "@/components/landing/sample-catalog";
import {
  AFCI,
  DropZone,
  FilePair,
  ProductShot,
  QO120,
  SheetTable,
  ease,
  useCycle,
} from "@/components/landing/landing-visuals";
import { ConfidenceBadge, NeedsReviewBadge } from "@/components/workspace/status-badge";
import { PRODUCT_DELIVERY_HEADERS } from "@/server/services/product-delivery/headers";

export function WhyPicture() {
  const reduce = useReducedMotion();
  const lineup = [
    SAMPLE_PRODUCTS[0],
    SAMPLE_PRODUCTS[3],
    SAMPLE_PRODUCTS[1],
    SAMPLE_PRODUCTS[2],
  ];
  const { index } = useCycle(lineup.length, 2200);
  const active = reduce ? 0 : index;
  const product = lineup[active] ?? lineup[0];
  const name = product.productName ?? product.rawMpn ?? "Product";
  const path = product.verifiedClasspath ?? product.proposedClasspath;

  return (
    <div className="mt-8 overflow-hidden rounded-[28px] bg-surface ring-1 ring-border">
      <div className="grid lg:grid-cols-2">
        <div className="border-b border-border p-5 lg:border-r lg:border-b-0">
          <p className="text-[10px] font-medium tracking-[0.16em] text-muted uppercase">
            What you upload
          </p>
          <p className="mt-1 text-sm font-medium">A messy supplier spreadsheet</p>
          <p className="mt-1 text-xs leading-5 text-muted">
            Abbreviations, blanks, and no storefront fields. This cannot go live.
          </p>
          <div className="mt-4">
            <SheetTable mode="messy" full activeRow={active} />
          </div>
        </div>
        <div className="p-5">
          <p className="text-[10px] font-medium tracking-[0.16em] text-accent uppercase">
            What you get
          </p>
          <p className="mt-1 text-sm font-medium">A commerce-ready catalog</p>
          <p className="mt-1 text-xs leading-5 text-muted">
            Real brand, manufacturer photo, and Dept / Class / Fine on the same row.
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={product.id}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.35, ease }}
              className="mt-4 flex items-center gap-4 rounded-2xl bg-canvas p-3 ring-1 ring-border"
            >
              <ProductShot src={product.imageUrl ?? QO120} alt={name} className="h-24 w-24 shrink-0" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{name}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {product.brand} · {product.rawMpn}
                </p>
                <p className="mt-2 truncate text-[11px] text-accent">{path}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          <ul className="mt-4 grid grid-cols-4 gap-2">
            {lineup.map((item, i) => (
              <li
                key={item.id}
                className={`overflow-hidden rounded-xl ring-1 transition-shadow ${
                  i === active ? "ring-accent" : "ring-border"
                }`}
              >
                <ProductShot
                  src={item.imageUrl ?? QO120}
                  alt={item.productName ?? "Product"}
                  className="aspect-square rounded-none shadow-none ring-0"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-3">
        {[
          { label: "Brand", before: "SQD, SCHNEIDR", after: "Square D, Schneider Electric" },
          { label: "Photo", before: "Blank cell", after: "Manufacturer image attached" },
          { label: "Path", before: "No Dept / Class / Fine", after: "Classpath written for the storefront" },
        ].map((item) => (
          <div key={item.label} className="bg-surface px-5 py-4">
            <p className="text-xs font-medium">{item.label}</p>
            <p className="mt-1 text-[11px] text-failed">{item.before}</p>
            <p className="mt-0.5 text-[11px] text-accent">{item.after}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function KeepVsWrite() {
  const reduce = useReducedMotion();
  const { index } = useCycle(3, 2800);
  const maps = [
    { raw: "E1_Brand", value: "SQD", field: "brand", out: "Square D" },
    { raw: "Part_Manuf", value: "SQUARE D", field: "manufacturer", out: "Schneider Electric" },
    { raw: "Mfg_Part_Num", value: "QO120", field: "mpn", out: "QO120" },
  ] as const;
  const row = maps[index] ?? maps[0];

  return (
    <section id="interpret" className="scroll-mt-24 px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-[10px] font-medium tracking-[0.18em] text-accent uppercase">Interpret</p>
        <h2 className="mt-1.5 text-xl font-semibold tracking-tight">The raw cell stays. The catalog field is new.</h2>
        <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted">
          SQD is what the supplier typed. Square D is what a catalog can sell. Comersly writes the second without editing the first.
        </p>

        <div className="mt-6 overflow-hidden rounded-[28px] bg-surface p-4 sm:p-6">
          <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
            <div className="rounded-2xl bg-canvas p-4 ring-1 ring-border">
              <p className="text-[10px] font-medium tracking-[0.14em] text-muted uppercase">
                Supplier cell
              </p>
              <p className="mt-2 font-mono text-[10px] text-muted">{row.raw}</p>
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
                {row.field}
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
        <h2 className="mt-1.5 text-xl font-semibold tracking-tight">Classification waits on a manufacturer page.</h2>
        <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted">
          Comersly opens the source, reads the name and photo, then scores confidence. Guesswork stays out of Dept, Class, and Fine.
        </p>

        <motion.div
          className="mx-auto mt-6 max-w-lg overflow-hidden rounded-[28px] bg-surface ring-1 ring-border"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="relative flex h-9 items-center gap-1.5 bg-surface-muted px-3">
            <span className="h-2 w-2 rounded-full bg-failed" />
            <span className="h-2 w-2 rounded-full bg-review" />
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="ml-2 truncate font-mono text-[10px] text-muted">
              {checking ? "Finding manufacturer page…" : "se.com/us/en/product/QO120"}
            </span>
            {checking ? (
              <motion.span
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-accent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.4, ease }}
              />
            ) : null}
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
        <h2 className="mt-1.5 text-xl font-semibold tracking-tight">High confidence ships. The rest wait.</h2>
        <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted">
          A person only opens rows that need a look. The rest of the catalog is already named, pathed, and photographed.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <motion.article
            className="rounded-[28px] bg-surface p-4 ring-1 ring-border"
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
            className="rounded-[28px] bg-surface p-4 ring-1 ring-border"
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

const EXPORT_CELLS = PRODUCT_DELIVERY_HEADERS.slice(0, 12);

export function ExportGrid() {
  const reduce = useReducedMotion();
  const [filled, setFilled] = useState(reduce ? EXPORT_CELLS.length : 0);
  const featured = SAMPLE_PRODUCTS;

  useEffect(() => {
    if (reduce) {
      return;
    }
    const timer = window.setInterval(() => {
      setFilled((current) => (current >= EXPORT_CELLS.length ? 0 : current + 1));
    }, 180);
    return () => window.clearInterval(timer);
  }, [reduce]);

  return (
    <div className="mt-6 overflow-hidden rounded-[28px] bg-surface ring-1 ring-border">
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <p className="text-[10px] font-medium tracking-[0.16em] text-muted uppercase">
            Catalog
          </p>
          <p className="mt-1 text-sm font-medium">48 products ready to deliver</p>
          <ul className="mt-4 grid grid-cols-4 gap-2">
            {featured.map((product) => {
              const name = product.productName ?? product.rawMpn ?? "Product";
              return (
                <li key={product.id}>
                  <ProductShot
                    src={product.imageUrl ?? QO120}
                    alt={name}
                    className="aspect-square shadow-none"
                  />
                  <p className="mt-1.5 truncate text-[10px] font-medium">{product.rawMpn}</p>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-medium tracking-[0.16em] text-accent uppercase">
            Delivery file
          </p>
          <p className="mt-1 text-sm font-medium">One click · CSV or XLSX</p>
          <div className="mt-4 h-36">
            <FilePair active={filled > 6 ? "xlsx" : "csv"} />
          </div>
        </div>
      </div>
      <div className="border-t border-border px-5 py-4 sm:px-6">
        <p className="text-xs text-muted">Columns written into the export</p>
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
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
        <h2 className="mt-1.5 text-xl font-semibold tracking-tight">Built for teams who inherit supplier files.</h2>
        <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted">
          Distributors, catalog editors, and PIM owners drop a sheet and get products they can export.
        </p>

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
            <p className="mt-2 px-2 text-center text-xs font-medium">Drop the messy file</p>
            <p className="px-2 pb-3 text-center text-[11px] text-muted">CSV or XLSX from a supplier</p>
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
            <p className="mt-3 text-center text-xs font-medium">Open the catalog</p>
            <p className="pb-1 text-center text-[11px] text-muted">Photos, brands, and paths</p>
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
            <p className="mt-2 px-2 text-center text-xs font-medium">Download the export</p>
            <p className="px-2 pb-3 text-center text-[11px] text-muted">Commerce-ready CSV or XLSX</p>
          </motion.li>
        </ul>
      </div>
    </section>
  );
}

export function CloseCta({ href, label }: { href: string; label: string }) {
  const reduce = useReducedMotion();

  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28">
      <motion.div
        className="mx-auto max-w-2xl overflow-hidden rounded-[28px] bg-surface ring-1 ring-border"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
      >
        <ul className="grid grid-cols-4 gap-px bg-border">
          {SAMPLE_PRODUCTS.map((product) => {
            const name = product.productName ?? product.rawMpn ?? "Product";
            return (
              <li key={product.id} className="bg-product-well p-3 sm:p-5">
                <ProductShot
                  src={product.imageUrl ?? QO120}
                  alt={name}
                  className="aspect-square shadow-none ring-0"
                />
              </li>
            );
          })}
        </ul>
        <div className="px-6 py-10 text-center sm:px-10">
          <h2 className="text-xl font-semibold tracking-tight text-balance sm:text-2xl">
            Just upload a messy spreadsheet.
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Get the commerce-ready file in one click.
          </p>
          <a
            href={href}
            className="mt-7 inline-flex h-11 items-center rounded-full bg-accent px-7 text-sm font-medium text-accent-foreground hover:bg-accent-hover"
          >
            {label}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
