"use client";

import Link from "next/link";
import { useState } from "react";

import { CopyButton } from "@/components/workspace/copy-button";
import { ProductImage } from "@/components/workspace/product-image";
import { ProductPipeline } from "@/components/workspace/pipeline";
import { cn } from "@/lib/cn";

type HeroImage = {
  url: string;
  altText: string | null;
};

export function ProductHero({
  importId,
  importFileName,
  rowNumber,
  title,
  brand,
  manufacturer,
  mpn,
  productType,
  description,
  isReady,
  needsReview,
  confidence,
  sourceUrl,
  images,
  stages,
}: {
  importId: string;
  importFileName: string;
  rowNumber: number;
  title: string;
  brand: string | null;
  manufacturer: string | null;
  mpn: string | null;
  productType: string | null;
  description: string | null;
  isReady: boolean;
  needsReview: boolean;
  confidence: "HIGH" | "MEDIUM" | "LOW" | null;
  sourceUrl: string | null;
  images: HeroImage[];
  stages: { label: string; done: boolean }[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? null;

  return (
    <section className="grid items-start gap-8 lg:grid-cols-2">
      <div>
        <div className="overflow-hidden rounded-2xl border border-border bg-product-well">
          <ProductImage
            src={active?.url}
            alt={active?.altText ?? title}
            className="aspect-square w-full bg-product-well"
            imgClassName="object-contain p-8"
          />
        </div>
        {images.length > 1 ? (
          <ul className="mt-3 flex gap-2 overflow-x-auto">
            {images.slice(0, 8).map((image, index) => (
              <li key={image.url}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "h-14 w-14 overflow-hidden rounded-xl border bg-product-well",
                    index === activeIndex ? "border-accent" : "border-border",
                  )}
                  aria-label={`Show image ${index + 1}`}
                >
                  <ProductImage
                    src={image.url}
                    alt={image.altText ?? `Product image ${index + 1}`}
                    className="h-full w-full"
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div>
        <p className="text-sm text-muted">
          <Link href={`/imports/${importId}`} className="hover:text-foreground">
            {importFileName}
          </Link>
          <span> · row {rowNumber}</span>
        </p>
        <p className="mt-3 text-sm font-medium text-accent">
          {brand ?? "Unverified brand"}
        </p>
        <h1 className="mt-1 text-3xl tracking-tight text-balance">{title}</h1>
        {manufacturer ? (
          <p className="mt-2 text-sm text-muted">{manufacturer}</p>
        ) : null}

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6">
          <div>
            <dt className="text-xs text-muted">Status</dt>
            <dd className="mt-1 text-sm font-medium">
              {isReady ? "Ready" : "In progress"}
              {needsReview ? " · Review" : ""}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Confidence</dt>
            <dd className="mt-1 text-sm font-medium">
              {confidence
                ? confidence.charAt(0) + confidence.slice(1).toLowerCase()
                : "—"}
            </dd>
          </div>
          {productType ? (
            <div>
              <dt className="text-xs text-muted">Type</dt>
              <dd className="mt-1 text-sm font-medium">{productType}</dd>
            </div>
          ) : null}
          {mpn ? (
            <div>
              <dt className="text-xs text-muted">MPN</dt>
              <dd className="mt-1 flex items-center gap-2 text-sm font-medium">
                {mpn}
                <CopyButton value={mpn} />
              </dd>
            </div>
          ) : null}
        </dl>

        {description ? (
          <p className="mt-6 text-sm leading-7 text-muted">{description}</p>
        ) : (
          <p className="mt-6 text-sm leading-7 text-muted">
            Manufacturer evidence and copy appear here as the pipeline completes.
          </p>
        )}

        {sourceUrl ? (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex h-10 items-center rounded-xl bg-accent px-4 text-sm font-medium text-accent-foreground hover:bg-accent-hover"
          >
            Manufacturer source
          </a>
        ) : null}

        <div className="mt-8 border-t border-border pt-6">
          <ProductPipeline stages={stages} />
        </div>
      </div>
    </section>
  );
}
