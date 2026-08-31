"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";

export function ProductImage({
  src,
  alt,
  className,
  imgClassName,
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden bg-product-well",
        className,
      )}
    >
      {showImage ? (
        // Manufacturer image hosts are unbounded, so next/image cannot allowlist them.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt={alt}
          className={cn("h-full w-full object-contain", imgClassName)}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-2xl font-bold text-accent/30" aria-hidden>
          C
        </span>
      )}
    </div>
  );
}
