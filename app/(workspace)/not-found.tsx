import Link from "next/link";

export default function NotFound() {
  return (
    <div className="surface-card px-6 py-14 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
        404
      </p>
      <h1 className="mt-2 font-serif text-2xl tracking-tight">Not found</h1>
      <p className="mt-2 text-sm text-muted">
        This import or product is not available in your workspace.
      </p>
      <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center rounded-full bg-ink px-4 text-sm font-medium text-ink-fg"
        >
          Back to dashboard
        </Link>
        <Link
          href="/imports"
          className="inline-flex h-10 items-center rounded-full border border-border bg-surface px-4 text-sm font-medium"
        >
          View imports
        </Link>
      </div>
    </div>
  );
}
