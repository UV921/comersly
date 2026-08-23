import type { Metadata } from "next";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { Landscape } from "@/components/landing/landscape";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This Comersly page does not exist.",
};

export default function NotFound() {
  return (
    <div className="relative min-h-full overflow-hidden">
      <Landscape
        id="not-found-landscape"
        variant="dusk"
        kenBurns
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-[var(--hero-overlay)]" />
      <div className="relative flex min-h-full flex-col items-center justify-center px-4 py-10">
        <div className="mb-6 flex w-full max-w-md items-center justify-between">
          <Logo />
          <ThemeToggle compact />
        </div>
        <div className="w-full max-w-md surface-card px-6 py-10 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
            404
          </p>
          <h1 className="mt-2 font-serif text-3xl tracking-tight">
            Page not found
          </h1>
          <p className="mt-3 text-sm text-muted">
            This URL is not part of Comersly. The page may have moved, or the
            link may be outdated.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex h-10 items-center rounded-full bg-ink px-4 text-sm font-medium text-ink-fg"
            >
              Back to home
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center rounded-full border border-border bg-surface px-4 text-sm font-medium"
            >
              Open workspace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
