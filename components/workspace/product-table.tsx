"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ProductImage } from "@/components/workspace/product-image";
import { cn } from "@/lib/cn";
import type { ProductRow } from "@/server/db/queries/workspace";

function productName(product: ProductRow) {
  return (
    product.productName ??
    product.rawDescription ??
    product.rawMpn ??
    "Untitled product"
  );
}

export function ProductStrip({
  products,
  interactive = true,
}: {
  products: ProductRow[];
  interactive?: boolean;
}) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {products.slice(0, 8).map((product) => {
        const name = productName(product);
        const body = (
          <>
            <div className="aspect-square overflow-hidden rounded-2xl bg-product-well">
              <ProductImage
                src={product.imageUrl}
                alt={name}
                className="h-full w-full bg-product-well"
                imgClassName="object-contain p-3"
              />
            </div>
            <p className="mt-3 truncate text-sm font-medium">{name}</p>
            <p className="truncate text-xs text-muted">
              {product.brand ?? product.rawMpn ?? "In pipeline"}
            </p>
          </>
        );

        return (
          <li key={product.id}>
            {interactive ? (
              <Link href={`/products/${product.id}`} className="block rounded-[22px] bg-canvas p-3">
                {body}
              </Link>
            ) : (
              <div className="rounded-[22px] bg-canvas p-3">{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function ProductGrid({
  products,
  showImport = false,
}: {
  products: ProductRow[];
  showImport?: boolean;
}) {
  if (products.length === 0) {
    return (
      <p className="py-10 text-sm text-muted">No products match these filters.</p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => {
        const name = productName(product);

        return (
          <li key={product.id}>
            <Link href={`/products/${product.id}`} className="group block">
              <div className="aspect-square overflow-hidden rounded-2xl bg-product-well">
                <ProductImage
                  src={product.imageUrl}
                  alt={name}
                  className="h-full w-full bg-product-well"
                  imgClassName="object-contain p-5 transition duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <p className="mt-3 truncate text-sm font-medium">{name}</p>
              <p className="truncate text-xs text-muted">
                {[product.brand, product.rawMpn, showImport ? product.importFileName : null]
                  .filter(Boolean)
                  .join(" · ") || "Awaiting verification"}
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 rounded-xl px-3 text-sm transition",
        active
          ? "bg-accent text-accent-foreground"
          : "border border-border bg-surface text-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function ProductTable({
  products,
  showImport = false,
  initialQuery = "",
  showFilters = true,
}: {
  products: ProductRow[];
  showImport?: boolean;
  initialQuery?: string;
  showFilters?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState<"all" | "ready" | "processing">("all");
  const [review, setReview] = useState<"all" | "review">("all");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return products.filter((product) => {
      if (status === "ready" && !product.isReady) {
        return false;
      }

      if (status === "processing" && product.isReady) {
        return false;
      }

      if (review === "review" && !product.needsReview) {
        return false;
      }

      if (!needle) {
        return true;
      }

      const haystack = [
        product.rawMpn,
        product.rawDescription,
        product.brand,
        product.manufacturer,
        product.productType,
        product.productName,
        product.proposedClasspath,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    });
  }, [products, query, review, status]);

  return (
    <div>
      {showFilters ? (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <input
            id="product-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter by name, brand, or part number"
            className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm outline-none placeholder:text-muted focus:border-accent sm:max-w-sm"
          />
          <div className="flex flex-wrap gap-2">
            <FilterChip active={status === "all"} onClick={() => setStatus("all")}>
              All
            </FilterChip>
            <FilterChip
              active={status === "ready"}
              onClick={() => setStatus("ready")}
            >
              Ready
            </FilterChip>
            <FilterChip
              active={status === "processing"}
              onClick={() => setStatus("processing")}
            >
              In progress
            </FilterChip>
            <FilterChip
              active={review === "review"}
              onClick={() => setReview(review === "review" ? "all" : "review")}
            >
              Needs review
            </FilterChip>
          </div>
        </div>
      ) : null}

      <ProductGrid products={filtered} showImport={showImport} />
    </div>
  );
}
