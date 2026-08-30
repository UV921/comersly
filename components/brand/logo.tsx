import Link from "next/link";

import { ComerslyMark } from "@/components/brand/comersly-mark";
import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return <ComerslyMark className={className} />;
}

export function Logo({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5", className)}>
      <ComerslyMark />
      <span className="text-[15px] font-semibold tracking-tight text-foreground">
        Comersly
      </span>
    </Link>
  );
}
