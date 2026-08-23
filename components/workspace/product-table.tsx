"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { ProductRow } from "@/server/db/queries/workspace";

import {
  ConfidenceBadge,
  NeedsReviewBadge,
  ProductStateBadge,
} from "./status-badge";

export function ProductTable({
  products,
  showImport = false,
}: {
  products: ProductRow[];
  showImport?: boolean;
}) {
  const [query, setQuery] = useState("");
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
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="product-search">
          Search products
        </label>
        <input
          id="product-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search part number, description, brand..."
          className="h-10 w-full rounded-full border border-border bg-surface px-4 text-sm sm:max-w-sm"
        />
        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as "all" | "ready" | "processing")
          }
          className="h-10 rounded-full border border-border bg-surface px-3 text-sm"
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="ready">Ready</option>
          <option value="processing">Processing</option>
        </select>
        <select
          value={review}
          onChange={(event) => setReview(event.target.value as "all" | "review")}
          className="h-10 rounded-full border border-border bg-surface px-3 text-sm"
          aria-label="Filter by review"
        >
          <option value="all">All review states</option>
          <option value="review">Needs review</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="surface-card border-dashed px-6 py-10 text-center text-sm text-muted">
          No products match your filters
        </div>
      ) : (
        <div className="surface-card overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-muted text-xs font-medium uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-2.5 font-medium">Manufacturer part #</th>
                <th className="px-4 py-2.5 font-medium">Original description</th>
                <th className="px-4 py-2.5 font-medium">Brand</th>
                <th className="px-4 py-2.5 font-medium">Manufacturer</th>
                <th className="px-4 py-2.5 font-medium">Product type</th>
                <th className="px-4 py-2.5 font-medium">Classification</th>
                <th className="px-4 py-2.5 font-medium">Confidence</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Review</th>
                {showImport ? (
                  <th className="px-4 py-2.5 font-medium">Import</th>
                ) : null}
                <th className="px-4 py-2.5 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border last:border-0 hover:bg-surface-muted/60"
                >
                  <td className="px-4 py-3 font-medium">
                    {product.rawMpn ?? "—"}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-muted">
                    {product.rawDescription ?? "—"}
                  </td>
                  <td className="px-4 py-3">{product.brand ?? "—"}</td>
                  <td className="px-4 py-3">{product.manufacturer ?? "—"}</td>
                  <td className="px-4 py-3">{product.productType ?? "—"}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-muted">
                    {product.proposedClasspath ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <ConfidenceBadge confidence={product.confidence} />
                  </td>
                  <td className="px-4 py-3">
                    <ProductStateBadge isReady={product.isReady} />
                  </td>
                  <td className="px-4 py-3">
                    {product.needsReview ? <NeedsReviewBadge /> : "—"}
                  </td>
                  {showImport ? (
                    <td className="px-4 py-3 text-muted">{product.importFileName}</td>
                  ) : null}
                  <td className="px-4 py-3">
                    <Link
                      href={`/products/${product.id}`}
                      className="font-medium text-accent hover:underline"
                    >
                      View product
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
