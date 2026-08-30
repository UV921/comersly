import type { Metadata } from "next";
import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This Comersly page does not exist.",
};

export default function NotFound() {
  return (
    <div className="landing-shell relative flex min-h-full flex-col">
      <div className="landing-grid pointer-events-none absolute inset-0" />
      <div className="relative flex min-h-full flex-col items-center justify-center px-4 py-16">
        <div className="mb-8">
          <BrandMark />
        </div>
        <div className="w-full max-w-md rounded-3xl border border-border bg-surface/80 px-6 py-10 text-center">
          <p className="text-[13px] font-medium tracking-[0.22em] text-brass uppercase">
            404
          </p>
          <h1 className="mt-3 text-4xl">Page not found</h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            This URL is not part of Comersly. The page may have moved, or the
            link may be outdated.
          </p>
          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-medium text-white hover:bg-accent-hover"
            >
              Back to home
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center rounded-full border border-border px-5 text-sm hover:bg-surface-muted"
            >
              Open workspace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
