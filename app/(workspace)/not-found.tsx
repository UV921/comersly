import Link from "next/link";

export default function NotFound() {
  return (
    <div className="surface-card px-6 py-14 text-center">
      <h1 className="font-serif text-2xl tracking-tight">Not found</h1>
      <p className="mt-2 text-sm text-muted">
        This import or product is not available in your workspace.
      </p>
      <Link
        href="/dashboard"
        className="mt-5 inline-flex h-10 items-center rounded-full bg-ink px-4 text-sm font-medium text-ink-fg"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
