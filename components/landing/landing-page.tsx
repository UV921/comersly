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
import { CloudShader } from "@/components/ui/cloud-shader";
import { useTheme } from "@/components/theme/theme-provider";

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
  "inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-white hover:bg-accent-hover";
const ghostCta =
  "inline-flex h-11 items-center rounded-full bg-surface/80 px-6 text-sm font-medium text-foreground backdrop-blur-sm hover:bg-surface";

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduce = useReducedMotion();
  const { isSignedIn } = useAuth();
  const { theme } = useTheme();
  const dark = theme === "dark";

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

      <section className="relative isolate overflow-hidden">
        <CloudShader
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          speed={0.32}
          count={6}
          cloudColor={dark ? "#d7ece6" : "#ffffff"}
          skyTopColor={dark ? "#1a3d34" : "#8aa89a"}
          skyBottomColor={dark ? "#0c1412" : "#f6f4ef"}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-24 bg-gradient-to-t from-canvas to-transparent" />

        <div className="relative z-10 px-5 pt-12 pb-14 sm:px-8 sm:pt-16 sm:pb-16">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease }}
              className="text-[11px] font-medium tracking-[0.2em] text-accent uppercase"
            >
              Catalogs from supplier files
            </motion.p>
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05, ease }}
              className="mt-3 text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
            >
              Supplier spreadsheets, turned into a catalog.
            </motion.h1>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease }}
              className="mt-3 max-w-md text-sm leading-6 text-muted"
            >
              Each row is read, checked, classified, and given a photo.
            </motion.p>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16, ease }}
              className="mt-7 flex flex-wrap items-center justify-center gap-3"
            >
              <Link href={isSignedIn ? "/dashboard" : "/sign-up"} className={primaryCta}>
                {isSignedIn ? "Open workspace" : "Start with a spreadsheet"}
              </Link>
              <a href="#how" className={ghostCta}>
                See how it works
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-10 w-full max-w-4xl"
          >
            <HeroDashboard />
          </motion.div>
        </div>
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
          label={isSignedIn ? "Open workspace" : "Start with a spreadsheet"}
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
