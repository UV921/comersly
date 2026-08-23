"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Logo } from "@/components/brand/logo";
import { Landscape } from "@/components/landing/landscape";
import {
  AccuracyMockup,
  DashboardMockup,
  LiveSourceMockup,
  ProductSearchMockup,
  PromptMockup,
} from "@/components/landing/mockups";
import { Reveal } from "@/components/landing/reveal";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#product", label: "Product" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

const ASK_PROMPT =
  "What is Comersly, and how does it turn messy industrial product spreadsheets into verified catalog records with manufacturer evidence, classification, enrichment, generated content, asset discovery, and a 252-column delivery export?";

function PrimaryCta({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-medium text-ink-fg transition hover:opacity-90"
    >
      {children}
    </Link>
  );
}

function AuthActions({
  signedOut,
  signedIn,
}: {
  signedOut: React.ReactNode;
  signedIn: React.ReactNode;
}) {
  const { isSignedIn } = useAuth();
  return <>{isSignedIn ? signedIn : signedOut}</>;
}

function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors",
        scrolled || open
          ? "border-b border-border bg-[var(--nav-bg)] backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle compact />
          <AuthActions
            signedOut={
              <>
                <Link href="/sign-in" className="text-sm text-muted hover:text-foreground">
                  Log in
                </Link>
                <PrimaryCta href="/sign-up">Start free trial</PrimaryCta>
              </>
            }
            signedIn={<PrimaryCta href="/dashboard">Open workspace</PrimaryCta>}
          />
        </div>
        <button
          type="button"
          className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
        >
          Menu
        </button>
      </div>
      {open ? (
        <div className="space-y-3 border-t border-border bg-background px-4 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-sm"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <ThemeToggle />
          <AuthActions
            signedOut={
              <div className="flex items-center gap-3">
                <Link href="/sign-in" className="text-sm">
                  Log in
                </Link>
                <PrimaryCta href="/sign-up">Start free trial</PrimaryCta>
              </div>
            }
            signedIn={<PrimaryCta href="/dashboard">Open workspace</PrimaryCta>}
          />
        </div>
      ) : null}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Landscape
        id="hero-landscape"
        variant="meadow"
        kenBurns
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-[var(--hero-overlay)]" />
      <div className="relative mx-auto max-w-4xl px-4 pb-8 pt-16 text-center sm:px-6 sm:pt-24">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
          Industrial product intelligence
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-[1.08] tracking-tight text-foreground sm:text-6xl">
          Stop guessing what each product actually is.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
          Comersly reads messy distributor spreadsheets, verifies manufacturer
          identity from live sources, then classifies, enriches, writes catalog
          copy, and exports a delivery-ready file.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <AuthActions
            signedOut={<PrimaryCta href="/sign-up">Get started for free →</PrimaryCta>}
            signedIn={<PrimaryCta href="/dashboard">Continue to workspace →</PrimaryCta>}
          />
          <p className="text-xs text-muted">
            No credit card required · CSV and XLSX · Cancel anytime
          </p>
        </div>
        <div className="float-y mx-auto mt-12 max-w-xl text-left">
          <ProductSearchMockup />
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      variant: "dawn" as const,
      title: "Upload your spreadsheet",
      body: "Drop a CSV or XLSX. Comersly interprets every row — even when columns, spellings, and part numbers are inconsistent.",
    },
    {
      variant: "grove" as const,
      title: "We verify the real product",
      body: "Manufacturer candidates are checked against live source pages. Brand is evidence, not the supplier label sitting in the file.",
    },
    {
      variant: "dusk" as const,
      title: "Export a catalog that ships",
      body: "Classification, attributes, content, and assets land in the 252-column delivery format your downstream systems already expect.",
    },
  ];

  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          How it works
        </p>
        <h2 className="mt-3 max-w-xl font-serif text-4xl tracking-tight">
          Three steps from a messy file to a trusted catalog.
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <Reveal key={step.title} delay={index * 120}>
            <article className="surface-card overflow-hidden">
              <Landscape
                id={`step-${index}`}
                variant={step.variant}
                className="h-36"
              />
              <div className="p-5">
                <p className="text-xs font-medium text-muted">
                  Step {index + 1}
                </p>
                <h3 className="mt-1 font-serif text-2xl tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Problems() {
  const items = [
    {
      title: "Spreadsheets that do not agree",
      body: "Every distributor file uses different headers, units, and junk rows. Analysts spend days just making columns line up.",
    },
    {
      title: "Supplier labels posing as brands",
      body: "The name in the spreadsheet is often the seller, not the manufacturer. Catalogs inherit the wrong identity.",
    },
    {
      title: "Part numbers without proof",
      body: "An MPN is not a product until it is tied to a manufacturer page, datasheet, or other live evidence.",
    },
    {
      title: "Classification by memory",
      body: "Dept, Class, Fine, and classpath get guessed from tribal knowledge instead of verified product type.",
    },
    {
      title: "Attributes copied from the wrong page",
      body: "Voltage, dimensions, and UOM drift when people scrape the first search result that looks close enough.",
    },
    {
      title: "Empty storefront copy",
      body: "Short, long, retail, and invoice descriptions are left blank — or pasted from a competitor’s listing.",
    },
    {
      title: "No images, no assets",
      body: "Product photos and documents stay behind manufacturer sites while the catalog ships without them.",
    },
    {
      title: "Hand-mapping 252 columns",
      body: "The delivery template is unforgiving. One missed field and the whole file comes back from operations.",
    },
  ];

  return (
    <section className="bg-surface-muted/60 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Problems we solved
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-4xl tracking-tight">
            Catalog work failed for the same eight reasons. Comersly was built to close all of them.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <Reveal key={item.title} delay={index * 60}>
              <article className="surface-card h-full p-5">
                <p className="text-xs font-medium text-accent">
                  0{index + 1}
                </p>
                <h3 className="mt-2 font-serif text-xl tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    title: "Precision identity matching",
    body: "Direct candidates plus semantic interpretation recover manufacturer, brand, and MPN from noisy source rows.",
    icon: "◎",
  },
  {
    title: "Manufacturer verification",
    body: "We look up live manufacturer evidence so identity is sourced, not inferred from a vendor column.",
    icon: "▣",
  },
  {
    title: "Classification that holds up",
    body: "Dept, Class, Fine, and classpath are proposed with confidence and a needs-review flag when the proof is thin.",
    icon: "▤",
  },
  {
    title: "Live attribute enrichment",
    body: "Specs are pulled from manufacturer pages, then normalized so units and labels stop drifting.",
    icon: "✦",
  },
  {
    title: "Catalog-ready content",
    body: "Mobile, invoice, short, long, retail, and marketing descriptions are generated from verified identity.",
    icon: "✎",
  },
  {
    title: "252-column delivery export",
    body: "CSV and XLSX download in the exact delivery template operations already use — not a parallel format.",
    icon: "↓",
  },
];

function ProductPreview() {
  return (
    <section id="product" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Workspace
        </p>
        <h2 className="mt-3 max-w-2xl font-serif text-4xl tracking-tight">
          Everything you need to find the real product behind each row.
        </h2>
      </Reveal>
      <Reveal delay={120} className="mt-10">
        <DashboardMockup />
      </Reveal>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 70}>
            <article className="surface-card h-full p-5 transition hover:-translate-y-1">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
                {feature.icon}
              </span>
              <h3 className="mt-4 font-serif text-xl tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">{feature.body}</p>
              <a href="#how-it-works" className="mt-4 inline-block text-sm font-medium text-accent">
                Learn more →
              </a>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Comparison() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Reveal className="text-center">
        <h2 className="font-serif text-4xl tracking-tight">
          Built on accuracy, not volume.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          More rows is easy. Comersly is opinionated about the ones that are actually true.
        </p>
      </Reveal>
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <p className="mb-3 font-serif text-2xl">Verified, not guessed</p>
          <p className="mb-5 text-sm text-muted">
            Match scores come from manufacturer evidence, not a fuzzy vendor string.
          </p>
          <AccuracyMockup />
        </Reveal>
        <Reveal delay={120}>
          <p className="mb-3 font-serif text-2xl">Current, not archived</p>
          <p className="mb-5 text-sm text-muted">
            Sources stay live. Stale PDFs and distributor feeds are labeled instead of trusted.
          </p>
          <LiveSourceMockup />
        </Reveal>
      </div>
    </section>
  );
}

function AiNative() {
  return (
    <section className="bg-[#111111] py-24 text-[#f7f6f1]">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#8fbfa8]">
            AI-native pipeline
          </p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight">
            A product brain that reads the row the way a catalog analyst would.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#c9c4b8]">
            Interpretation, manufacturer discovery, classification, enrichment,
            normalization, content, and assets run as one pipeline. You watch
            progress in the workspace instead of stitching six tools together.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-[#c9c4b8]">
            <li>— Semantic reading of messy spreadsheet cells</li>
            <li>— Manufacturer source discovery with evidence URLs</li>
            <li>— Needs-review flags when confidence is not high enough</li>
          </ul>
        </Reveal>
        <Reveal delay={120}>
          <PromptMockup />
        </Reveal>
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <Reveal>
        <blockquote className="font-serif text-3xl leading-snug tracking-tight">
          “We built Comersly because catalog teams were spending weeks cleaning
          files that still shipped with the wrong manufacturer.”
        </blockquote>
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
            C
          </div>
          <div className="text-left">
            <p className="text-sm font-medium">Comersly founding team</p>
            <p className="text-xs text-muted">Industrial catalog operations</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Pricing() {
  const [yearly, setYearly] = useState(false);

  const plans = [
    {
      name: "Starter",
      monthly: 49,
      yearly: 39,
      blurb: "First catalogs and proof-of-value imports.",
      features: [
        "500 products / month",
        "CSV and XLSX upload",
        "Identity + classification",
        "CSV delivery export",
      ],
      featured: false,
    },
    {
      name: "Growth",
      monthly: 149,
      yearly: 119,
      blurb: "The working catalog desk for ongoing enrichment.",
      features: [
        "5,000 products / month",
        "Manufacturer verification",
        "Content + asset pipeline",
        "CSV and XLSX export",
        "Needs-review queue",
      ],
      featured: true,
    },
    {
      name: "Max",
      monthly: 399,
      yearly: 319,
      blurb: "High-volume distributor and manufacturer desks.",
      features: [
        "25,000 products / month",
        "Priority processing",
        "Full 252-column delivery",
        "Workspace audit history",
        "Dedicated onboarding",
      ],
      featured: false,
    },
  ];

  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Reveal className="text-center">
        <h2 className="font-serif text-4xl tracking-tight">Simple pricing</h2>
        <p className="mt-3 text-muted">
          Start with a spreadsheet. Upgrade when the catalog is the bottleneck.
        </p>
        <div className="mt-6 inline-flex rounded-full border border-border bg-surface p-1">
          <button
            type="button"
            className={cn(
              "rounded-full px-4 py-1.5 text-sm",
              !yearly && "bg-ink text-ink-fg",
            )}
            onClick={() => setYearly(false)}
          >
            Monthly
          </button>
          <button
            type="button"
            className={cn(
              "rounded-full px-4 py-1.5 text-sm",
              yearly && "bg-ink text-ink-fg",
            )}
            onClick={() => setYearly(true)}
          >
            Yearly
          </button>
        </div>
      </Reveal>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {plans.map((plan, index) => {
          const price = yearly ? plan.yearly : plan.monthly;
          return (
            <Reveal key={plan.name} delay={index * 90}>
              <article
                className={cn(
                  "surface-card flex h-full flex-col p-6",
                  plan.featured && "ring-2 ring-ink lg:-translate-y-3",
                )}
              >
                {plan.featured ? (
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-accent">
                    Recommended
                  </p>
                ) : null}
                <h3 className="font-serif text-2xl">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted">{plan.blurb}</p>
                <p className="mt-5 font-serif text-5xl tracking-tight">
                  ${price}
                  <span className="text-base text-muted">/mo</span>
                </p>
                <ul className="mt-6 space-y-2 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span className="text-accent">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className={cn(
                    "mt-8 inline-flex h-11 items-center justify-center rounded-full text-sm font-medium",
                    plan.featured
                      ? "bg-ink text-ink-fg"
                      : "border border-border bg-background",
                  )}
                >
                  Start free trial
                </Link>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: "What files can I upload?",
    a: "CSV and XLSX up to 10MB. Comersly interprets messy headers instead of requiring a perfect template on the way in.",
  },
  {
    q: "How do you know the manufacturer is right?",
    a: "We extract manufacturer and brand candidates from the row, then verify them against live manufacturer evidence. Supplier labels are not treated as identity.",
  },
  {
    q: "What is the 252-column export?",
    a: "Completed imports download in the required delivery format used by downstream catalog operations — including identity, classification, descriptions, features, attributes, and reference URLs.",
  },
  {
    q: "What happens when the model is unsure?",
    a: "Low-confidence classifications are flagged for review in the workspace so a person can inspect evidence before the row is treated as ready.",
  },
  {
    q: "Do I need a credit card to try it?",
    a: "No. Create a workspace, upload a spreadsheet, and watch the pipeline run. You can cancel anytime.",
  },
];

function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <Reveal>
        <h2 className="text-center font-serif text-4xl tracking-tight">
          Common questions
        </h2>
      </Reveal>
      <div className="mt-10 divide-y divide-border border-y border-border">
        {FAQS.map((item, index) => {
          const expanded = open === index;
          return (
            <div key={item.q}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
                aria-expanded={expanded}
                onClick={() => setOpen(expanded ? -1 : index)}
              >
                <span className="font-medium">{item.q}</span>
                <span className="text-muted">{expanded ? "–" : "+"}</span>
              </button>
              {expanded ? (
                <p className="pb-4 text-sm leading-6 text-muted">{item.a}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AskAi() {
  const [copied, setCopied] = useState(false);
  const models = ["ChatGPT", "Claude", "Gemini", "Perplexity", "Grok", "Copy prompt"];

  const copy = async () => {
    await navigator.clipboard.writeText(ASK_PROMPT);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section className="bg-[#111111] py-20 text-[#f7f6f1]">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="font-serif text-4xl tracking-tight">Still not sure?</h2>
          <p className="mt-3 text-sm text-[#c9c4b8]">
            Ask the model you already trust. Copy a prompt that explains the full Comersly pipeline.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {models.map((model) => (
              <button
                key={model}
                type="button"
                onClick={copy}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-sm transition hover:bg-white/10"
              >
                {model === "Copy prompt" && copied ? "Copied" : model}
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden py-28">
      <Landscape
        id="cta-landscape"
        variant="dawn"
        kenBurns
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-[var(--hero-overlay)]" />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="font-serif text-4xl tracking-tight sm:text-5xl">
            Catalog work is now simpler than ever.
          </h2>
          <p className="mt-4 text-muted">
            Upload the file you already have. Comersly returns the catalog you were supposed to ship.
          </p>
          <div className="mt-8">
            <PrimaryCta href="/sign-up">Get started for free →</PrimaryCta>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background py-14">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted">
            Industrial product intelligence for teams that cannot ship a guessed catalog.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">Product</p>
          <div className="mt-3 space-y-2 text-sm text-muted">
            <a href="#how-it-works" className="block hover:text-foreground">
              How it works
            </a>
            <a href="#product" className="block hover:text-foreground">
              Workspace
            </a>
            <a href="#pricing" className="block hover:text-foreground">
              Pricing
            </a>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">Company</p>
          <div className="mt-3 space-y-2 text-sm text-muted">
            <Link href="/sign-in" className="block hover:text-foreground">
              Log in
            </Link>
            <Link href="/sign-up" className="block hover:text-foreground">
              Start free trial
            </Link>
            <a href="#faq" className="block hover:text-foreground">
              FAQ
            </a>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">Legal</p>
          <div className="mt-3 space-y-2 text-sm text-muted">
            <p>Privacy</p>
            <p>Terms</p>
            <ThemeToggle />
          </div>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl px-4 text-xs text-muted sm:px-6">
        © {new Date().getFullYear()} Comersly. All rights reserved.
      </p>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-full">
      <SiteHeader />
      <Hero />
      <HowItWorks />
      <Problems />
      <ProductPreview />
      <Comparison />
      <AiNative />
      <Testimonial />
      <Pricing />
      <Faq />
      <AskAi />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}
