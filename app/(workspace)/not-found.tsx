import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16">
      <h1 className="text-2xl tracking-tight">Not found</h1>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted">
        This import or product is not in your workspace.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center rounded-xl bg-accent px-4 text-sm font-medium text-accent-foreground"
        >
          Dashboard
        </Link>
        <Link
          href="/imports"
          className="inline-flex h-10 items-center rounded-xl border border-border bg-surface px-4 text-sm"
        >
          Imports
        </Link>
      </div>
    </div>
  );
}
