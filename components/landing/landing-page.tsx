"use client";

import { useAuth } from "@clerk/nextjs";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

import { HeroDashboard } from "@/components/landing/app-preview";
import {
  CloseCta,
  EvidenceSection,
  KeepVsWrite,
  ReviewSection,
  WhoSection,
} from "@/components/landing/landing-more";
import {
  CatalogSection,
  ClassifySection,
  DeliverySection,
  HowSection,
  PipelineSection,
  WhySection,
} from "@/components/landing/landing-story";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const NAV = [
  { href: "#why", label: "Why" },
  { href: "#how", label: "How" },
  { href: "#classify", label: "Classify" },
  { href: "#catalog", label: "Catalog" },
  { href: "#delivery", label: "Export" },
  { href: "#who", label: "Who" },
];

const ease = [0.16, 1, 0.3, 1] as const;

function AuthButtons({
  primaryClassName,
  secondaryClassName,
}: {
  primaryClassName: string;
  secondaryClassName?: string;
}) {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return (
      <Link href="/dashboard" className={primaryClassName}>
        Open workspace
      </Link>
    );
  }

  return (
    <>
      {secondaryClassName ? (
        <Link href="/sign-in" className={secondaryClassName}>
          Sign in
        </Link>
      ) : null}
      <Link href="/sign-up" className={primaryClassName}>
        Start
      </Link>
    </>
  );
}

const primaryCta =
  "inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-accent-foreground hover:bg-accent-hover";
const ghostCta =
  "inline-flex h-11 items-center rounded-full px-6 text-sm font-medium text-foreground ring-1 ring-border hover:bg-surface";

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduce = useReducedMotion();
  const { isSignedIn } = useAuth();

  return (
    <div className="workspace-shell">
      <header className="sticky top-0 z-30 bg-canvas/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <BrandMark href="/" variant="workspace" />
          <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-foreground">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <AuthButtons
              primaryClassName={primaryCta}
              secondaryClassName="text-sm text-muted hover:text-foreground"
            />
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="rounded-full bg-surface px-3 py-1.5 text-sm ring-1 ring-border"
              onClick={() => setMenuOpen((open) => !open)}
            >
              Menu
            </button>
          </div>
        </div>
        {menuOpen ? (
          <div className="space-y-3 px-5 py-4 md:hidden">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block text-sm"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <AuthButtons primaryClassName={primaryCta} secondaryClassName="block text-sm" />
          </div>
        ) : null}
      </header>

      <section className="px-5 pt-12 pb-12 sm:px-8 sm:pt-16 sm:pb-16">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="text-xl font-semibold tracking-tight text-balance sm:text-2xl sm:leading-snug"
          >
            Just upload a messy spreadsheet.
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06, ease }}
            className="mt-3 max-w-md text-sm leading-6 text-muted sm:text-base"
          >
            Get the commerce-ready file in one click.
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
          >
            <Link href={isSignedIn ? "/dashboard" : "/sign-up"} className={primaryCta}>
              {isSignedIn ? "Open workspace" : "Get started"}
            </Link>
            <a href="#how" className={ghostCta}>
              See how it works
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-10 w-full max-w-5xl"
        >
          <HeroDashboard />
          <p className="mt-3 text-center text-xs text-muted">
            The workspace after one import — classified products, ready to export.
          </p>
        </motion.div>
      </section>

      <main>
        <WhySection />
        <KeepVsWrite />
        <HowSection />
        <ClassifySection />
        <EvidenceSection />
        <ReviewSection />
        <PipelineSection />
        <CatalogSection />
        <DeliverySection />
        <WhoSection />
        <CloseCta
          href={isSignedIn ? "/dashboard" : "/sign-up"}
          label={isSignedIn ? "Open workspace" : "Get started"}
        />
      </main>

      <footer className="px-5 py-12 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <BrandMark href="/" variant="workspace" />
          <AuthButtons primaryClassName={primaryCta} />
        </div>
      </footer>
    </div>
  );
}
