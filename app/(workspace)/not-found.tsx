import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-lg border border-border bg-surface px-6 py-12 text-center">
      <h1 className="text-sm font-semibold">Not found</h1>
      <p className="mt-1 text-sm text-muted">
        This import or product is not available in your workspace.
      </p>
      <Link
        href="/"
        className="mt-4 inline-flex h-9 items-center rounded-md bg-accent px-3 text-sm font-medium text-white"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
