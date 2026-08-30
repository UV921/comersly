"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import {
  CatalogShowcase,
  ClassifyScene,
  HowScene,
} from "@/components/landing/landing-explainers";
import { ExportGrid, ProblemScenes } from "@/components/landing/landing-more";
import { ProductShot, QO120 } from "@/components/landing/landing-visuals";
import { ImportPipeline } from "@/components/workspace/pipeline";
import type { PipelineCounts } from "@/server/db/queries/workspace";

const PIPELINE_STAGES = [
  "Uploaded",
  "Interpreted",
  "Classified",
  "Enriched",
  "Normalized",
  "Content",
  "Assets",
] as const;

const ease = [0.16, 1, 0.3, 1] as const;

function PipelineStageVisual({ stage }: { stage: number }) {
  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <ProductShot src={QO120} alt="QO120" className="h-16 w-16" />
      <div>
        <p className="text-sm font-medium">{PIPELINE_STAGES[stage]}</p>
        <p className="text-xs text-muted">QO 20A 1-pole · Square D</p>
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
      className="max-w-xl"
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
          title="A spreadsheet is not a catalog."
          sub="Messy columns, no photo, no path."
        />
        <ProblemScenes />
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
          title="From a file to a catalog."
          sub="Six steps. The sheet stays raw."
        />
        <motion.div
          className="mt-6"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease }}
        >
          <HowScene />
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
          title="Watch the stages fill."
          sub="Same bars as the workspace."
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
            stage={Math.min(Math.floor(tick / 6), PIPELINE_STAGES.length - 1)}
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
          title="Dept, Class, and Fine."
          sub="One row becomes a storefront path."
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
          title="Ready products, with photos."
          sub="Name, brand, and a path you can open."
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
          title="Download the delivery file."
          sub="CSV or XLSX. Not the original sheet."
        />
        <ExportGrid />
      </div>
    </section>
  );
}
