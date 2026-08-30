import { cn } from "@/lib/cn";

/**
 * Classpath C
 *
 * Comersly turns spreadsheet rows into a classified catalog.
 * The open C is the catalog. The 2×2 grid is the supplier sheet.
 * The square at the opening is the product that found its place
 * (Dept → Class → Fine).
 */
export function ComerslyMark({
  className,
  inverted = false,
  title = "Comersly",
}: {
  className?: string;
  inverted?: boolean;
  title?: string;
}) {
  const badge = inverted ? "var(--surface)" : "var(--accent)";
  const ink = inverted ? "var(--accent)" : "var(--canvas)";

  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-8 w-8 shrink-0", className)}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <rect width="32" height="32" rx="8" fill={badge} />
      <path
        d="M23.1 8.7a9.05 9.05 0 1 0 0 14.6"
        fill="none"
        stroke={ink}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <rect x="10.1" y="12.3" width="3.15" height="3.15" rx="0.55" fill={ink} opacity="0.45" />
      <rect x="14" y="12.3" width="3.15" height="3.15" rx="0.55" fill={ink} opacity="0.45" />
      <rect x="10.1" y="16.25" width="3.15" height="3.15" rx="0.55" fill={ink} opacity="0.45" />
      <rect x="14" y="16.25" width="3.15" height="3.15" rx="0.7" fill={ink} />
      <rect x="21.35" y="13.7" width="4.7" height="4.7" rx="1.15" fill={ink} />
    </svg>
  );
}
