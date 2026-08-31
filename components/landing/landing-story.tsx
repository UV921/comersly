"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { HeroStory } from "@/components/landing/hero-story";
import {
  CatalogShowcase,
  ClassifyScene,
} from "@/components/landing/landing-explainers";
import { ExportGrid, WhyPicture } from "@/components/landing/landing-more";
import { ProductShot, QO120 } from "@/components/landing/landing-visuals";
import { ImportPipeline } from "@/components/workspace/pipeline";
import type { PipelineCounts } from "@/server/db/queries/workspace";

const PIPELINE_COPY = [
  { label: "Uploaded", detail: "The supplier file is stored. Rows are not products yet." },
  { label: "Interpreted", detail: "Raw cells are mapped to catalog fields." },
  { label: "Classified", detail: "Dept, Class, Fine, and Classpath are written." },
  { label: "Enriched", detail: "Manufacturer evidence is attached to the row." },
  { label: "Normalized", detail: "Units, names, and attributes are cleaned." },
  { label: "Content", detail: "Catalog copy is written from the verified product." },
  { label: "Assets", detail: "The manufacturer photo lands on the record." },
] as const;

const ease = [0.16, 1, 0.3, 1] as const;

function PipelineStageVisual({ stage }: { stage: number }) {
  const current = PIPELINE_COPY[stage] ?? PIPELINE_COPY[0];

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <ProductShot src={QO120} alt="QO120" className="h-16 w-16" />
      <div>
        <p className="text-sm font-medium">{current.label}</p>
        <p className="mt-0.5 text-xs leading-5 text-muted">{current.detail}</p>
        <p className="mt-1 text-xs text-muted">QO 20A 1-pole · Square D</p>
      </div>
    </div>
  );
}

function SectionIntro({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55, ease }}
      className="max-w-2xl"
    >
      <p className="text-[10px] font-medium tracking-[0.18em] text-accent uppercase">{eyebrow}</p>
      <h2 className="mt-1.5 text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1.5 text-sm leading-5 text-muted">{sub}</p>
    </motion.div>
  );
}

export function WhySection() {
  return (
    <section id="why" className="scroll-mt-24 px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          eyebrow="Why"
          title="A supplier spreadsheet cannot go on a storefront."
          sub="Abbreviations, no photos, no catalog path. That is what you upload — and what Comersly has to fix."
        />
        <WhyPicture />
      </div>
    </section>
  );
}

export function HowSection() {
  const reduce = useReducedMotion();

  return (
    <section id="how" className="scroll-mt-24 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          eyebrow="How"
          title="Upload. Interpret. Catalog. Export."
          sub="The full import — every messy row, not one product. Watch a file become a commerce-ready catalog."
        />
        <motion.div
          className="mt-6"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease }}
        >
          <HeroStory />
        </motion.div>
      </div>
    </section>
  );
}

export function PipelineSection() {
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(reduce ? 40 : 0);

  useEffect(() => {
    if (reduce) {
      return;
    }
    const timer = window.setInterval(() => {
      setTick((current) => (current >= 40 ? 0 : current + 1));
    }, 160);
    return () => window.clearInterval(timer);
  }, [reduce]);

  return (
    <section id="pipeline" className="scroll-mt-24 px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          eyebrow="Pipeline"
          title="Watch one import move through the stages."
          sub="Interpret, classify, write copy, then attach the manufacturer photo."
        />
        <motion.div
          className="mx-auto mt-6 max-w-3xl rounded-[28px] bg-surface px-6 py-8 sm:px-10"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease }}
        >
          <ImportPipeline counts={countsAt(tick)} />
          <PipelineStageVisual
            stage={Math.min(Math.floor(tick / 6), PIPELINE_COPY.length - 1)}
          />
        </motion.div>
      </div>
    </section>
  );
}

function countsAt(tick: number): PipelineCounts {
  const total = 40;
  const clamp = (value: number) => Math.max(0, Math.min(total, value));
  return {
    total,
    interpreted: clamp(tick),
    classified: clamp(tick - 6),
    enriched: clamp(tick - 12),
    normalized: clamp(tick - 16),
    content: clamp(tick - 22),
    assets: clamp(tick - 28),
  };
}

export function ClassifySection() {
  const reduce = useReducedMotion();

  return (
    <section id="classify" className="scroll-mt-24 px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          eyebrow="Classify"
          title="Each row gets a storefront path."
          sub="Dept, Class, and Fine are written from the manufacturer page — not from SQD or SCHNEIDR."
        />
        <motion.div
          className="mt-6"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease }}
        >
          <ClassifyScene />
        </motion.div>
      </div>
    </section>
  );
}

export function CatalogSection() {
  const reduce = useReducedMotion();

  return (
    <section id="catalog" className="scroll-mt-24 px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          eyebrow="Catalog"
          title="The sheet is now a catalog you can open."
          sub="Name, brand, photo, and path on every product — ready to review or export."
        />
        <motion.div
          className="mt-6"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease }}
        >
          <CatalogShowcase />
        </motion.div>
      </div>
    </section>
  );
}

export function DeliverySection() {
  return (
    <section id="delivery" className="scroll-mt-24 px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          eyebrow="Export"
          title="One click. Commerce-ready file."
          sub="CSV or XLSX with classified columns. The supplier sheet stays raw."
        />
        <ExportGrid />
      </div>
    </section>
  );
}
