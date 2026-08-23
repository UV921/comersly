import Link from "next/link";

import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="9" fill="var(--accent)" />
      <path
        d="M16.2 7.4c-2.8 3.1-4.7 6.2-4.7 9.2 0 3 2.1 5.4 4.7 5.4s4.7-2.4 4.7-5.4c0-3-1.9-6.1-4.7-9.2Z"
        fill="#eef6ef"
      />
      <path
        d="M16.2 9.8c1.7 2.1 2.8 4.1 2.8 6.2 0 1.9-1.3 3.4-2.8 3.4"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2", className)}
    >
      <LogoMark />
      <span className="font-serif text-lg tracking-tight text-foreground">
        Comersly
      </span>
    </Link>
  );
}
