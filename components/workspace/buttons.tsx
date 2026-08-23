import Link from "next/link";

export function PrimaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-10 items-center rounded-full bg-ink px-4 text-sm font-medium text-ink-fg hover:opacity-90"
    >
      {children}
    </Link>
  );
}

export function SecondaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-10 items-center rounded-full border border-border bg-surface px-4 text-sm font-medium text-foreground hover:bg-surface-muted"
    >
      {children}
    </Link>
  );
}
