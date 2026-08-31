import Link from "next/link";

import { ComerslyMark } from "@/components/brand/comersly-mark";
import { cn } from "@/lib/cn";

export function BrandMark({
  href = "/",
  inverted = false,
  compact = false,
  variant = "landing",
}: {
  href?: string;
  inverted?: boolean;
  compact?: boolean;
  variant?: "landing" | "workspace";
}) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5">
      <ComerslyMark inverted={inverted} className="h-8 w-8" />
      {compact ? null : variant === "workspace" ? (
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          Comersly
        </span>
      ) : (
        <span
          className={cn(
            "font-display text-[22px] leading-none tracking-tight",
            inverted ? "text-accent-foreground" : "text-foreground",
          )}
        >
          Comersly
        </span>
      )}
    </Link>
  );
}
