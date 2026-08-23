import Link from "next/link";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="surface-card border-dashed px-6 py-16 text-center">
      <h2 className="font-serif text-2xl tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
        {description}
      </p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-5 inline-flex h-10 items-center rounded-full bg-ink px-4 text-sm font-medium text-ink-fg hover:opacity-90"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
