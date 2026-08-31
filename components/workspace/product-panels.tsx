import type { ProductIntelligence } from "@/server/db/queries/workspace";
import { formatDocumentType } from "@/lib/product-display";

import { CopyButton } from "./copy-button";
import { ConfidenceBadge, NeedsReviewBadge } from "./status-badge";

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-border py-8 first:border-t-0 first:pt-0 last:pb-0">
      <h2 className="mb-5 text-base font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export function ProductSectionNav() {
  const items = [
    { href: "#classification", label: "Classification" },
    { href: "#attributes", label: "Attributes" },
    { href: "#copy", label: "Copy" },
    { href: "#files", label: "Files" },
    { href: "#sources", label: "Sources" },
  ];

  return (
    <nav
      aria-label="Product sections"
      className="mb-4 flex gap-2 overflow-x-auto pb-1"
    >
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="shrink-0 rounded-xl bg-surface px-3 py-1.5 text-sm text-muted ring-1 ring-border transition hover:text-foreground"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

function Field({
  label,
  value,
  extra,
}: {
  label: string;
  value: string | null | undefined;
  extra?: React.ReactNode;
}) {
  if (!value) {
    return null;
  }

  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1 flex items-center gap-2 text-[15px]">
        {value}
        {extra}
      </dd>
    </div>
  );
}

function ExternalUrl({ href, label }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex max-w-full items-center gap-1 text-sm underline decoration-border underline-offset-4 hover:decoration-foreground"
    >
      <span className="truncate">{label ?? href}</span>
    </a>
  );
}

export function ProductIdentityCard({
  product,
}: {
  product: ProductIntelligence;
}) {
  const evidence = product.manufacturerEvidence;
  const partNumber =
    evidence?.manufacturerPartNumber ?? product.rawMpn ?? null;

  return (
    <Section id="identity" title="Identity">
      <dl className="grid gap-6 sm:grid-cols-2">
        <Field label="Product name" value={evidence?.productName} />
        <Field label="Brand" value={evidence?.brandName} />
        <Field label="Manufacturer" value={evidence?.manufacturerName} />
        <Field
          label="Manufacturer part number"
          value={partNumber}
          extra={partNumber ? <CopyButton value={partNumber} /> : null}
        />
        <Field label="Series" value={evidence?.series} />
        <Field label="Product type" value={evidence?.productType} />
      </dl>

      {evidence?.sourceUrl ? (
        <div className="mt-6">
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">
            Manufacturer source
          </p>
          <div className="mt-1">
            <ExternalUrl href={evidence.sourceUrl} />
          </div>
        </div>
      ) : null}

      {!evidence ? (
        <p className="text-[15px] leading-7 text-muted">
          Verified identity appears after manufacturer evidence is extracted.
        </p>
      ) : null}

      {product.rawManufacturerLabel ? (
        <p className="mt-4 text-sm text-muted">
          Spreadsheet label: {product.rawManufacturerLabel}
        </p>
      ) : null}
    </Section>
  );
}

export function ClassificationPanel({
  product,
}: {
  product: ProductIntelligence;
}) {
  const verified = product.verifiedClassification;
  const proposed = product.proposedClassification;
  const verifiedPath = verified?.classpath ?? null;
  const proposedPath =
    proposed?.classpath ??
    ([proposed?.dept, proposed?.class, proposed?.fine]
      .filter(Boolean)
      .join(" > ") || null);

  return (
    <Section id="classification" title="Classification">
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <p className="text-xs text-muted">Verified</p>
          <p className="mt-2 font-semibold text-xl leading-snug">
            {verifiedPath ?? "Not available"}
          </p>
          {verified?.needsReview ? (
            <div className="mt-2">
              <NeedsReviewBadge />
            </div>
          ) : null}
        </div>
        <div>
          <p className="text-xs text-muted">Proposed</p>
          <p className="mt-2 text-[15px] leading-7">
            {proposedPath ?? "Not available"}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <ConfidenceBadge confidence={proposed?.confidence ?? null} />
            {proposed?.needsReview ? <NeedsReviewBadge /> : null}
          </div>
          {proposed?.reason ? (
            <p className="mt-3 text-sm leading-6 text-muted">{proposed.reason}</p>
          ) : null}
        </div>
      </div>
    </Section>
  );
}

export function AttributesTable({
  product,
}: {
  product: ProductIntelligence;
}) {
  const attributes = product.normalization?.attributes ?? [];

  return (
    <Section id="attributes" title="Attributes">
      {attributes.length === 0 ? (
        <p className="text-[15px] text-muted">No verified attributes yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-[11px] tracking-[0.16em] text-muted uppercase">
              <tr>
                <th className="pb-3 font-medium">Attribute</th>
                <th className="pb-3 font-medium">Value</th>
                <th className="pb-3 font-medium">UOM</th>
              </tr>
            </thead>
            <tbody>
              {attributes.map((attribute) => (
                <tr key={`${attribute.name}-${attribute.value}`} className="border-t border-border">
                  <td className="py-3">{attribute.name}</td>
                  <td className="py-3">{attribute.value}</td>
                  <td className="py-3 text-muted">{attribute.uom ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}

export function ProductContentPanel({
  product,
}: {
  product: ProductIntelligence;
}) {
  const content = product.content;
  const fields = [
    ["Mobile description", content?.mobileDescription],
    ["Invoice description", content?.invoiceDescription],
    ["Short description", content?.shortDescription],
    ["Long description", content?.longDescription],
    ["Retail description", content?.retailDescription],
    ["Marketing description", content?.marketingDescription],
  ] as const;

  const visible = fields.filter(([, value]) => Boolean(value));
  const features = content?.features ?? [];

  return (
    <Section id="copy" title="Copy">
      {visible.length === 0 && features.length === 0 ? (
        <p className="text-[15px] text-muted">Generated content is not available yet.</p>
      ) : (
        <div className="max-w-2xl space-y-6">
          {visible.map(([label, value]) => (
            <div key={label}>
              <p className="text-[11px] tracking-[0.16em] text-muted uppercase">
                {label}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-[15px] leading-7">{value}</p>
            </div>
          ))}
          {features.length > 0 ? (
            <div>
              <p className="text-[11px] tracking-[0.16em] text-muted uppercase">
                Features
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-7">
                {features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </Section>
  );
}

export function AssetGallery({
  product,
  showImages = true,
}: {
  product: ProductIntelligence;
  showImages?: boolean;
}) {
  const images = product.assets?.images ?? [];
  const documents = product.assets?.documents ?? [];
  const videos = product.assets?.videos ?? [];

  return (
    <Section id="files" title="Files">
      <div className="space-y-8">
        {showImages ? (
          <div>
            {images.length === 0 ? (
              <p className="text-[15px] text-muted">No manufacturer images found.</p>
            ) : (
              <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {images.map((image) => (
                  <li
                    key={image.url}
                    className="overflow-hidden rounded-[18px] bg-product-well"
                  >
                    <a href={image.url} target="_blank" rel="noreferrer">
                      {/* Manufacturer image hosts are unbounded, so next/image cannot allowlist them. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.url}
                        alt={image.altText ?? "Manufacturer product image"}
                        className="h-28 w-full object-contain p-2"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}

        <div>
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">
            Documents
          </p>
          {documents.length === 0 ? (
            <p className="mt-2 text-[15px] text-muted">None yet.</p>
          ) : (
            <ul className="mt-2 divide-y divide-border">
              {documents.map((document) => (
                <li key={document.url} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm">
                      {document.title ?? formatDocumentType(document.documentType)}
                    </p>
                    <p className="text-xs text-muted">
                      {formatDocumentType(document.documentType)}
                    </p>
                  </div>
                  <a
                    href={document.url}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-sm underline decoration-border underline-offset-4"
                  >
                    Open
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">
            Videos
          </p>
          {videos.length === 0 ? (
            <p className="mt-2 text-[15px] text-muted">None yet.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {videos.map((video) => (
                <li key={video.url}>
                  <ExternalUrl href={video.url} label={video.title ?? video.url} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Section>
  );
}

export function SourcesPanel({
  product,
}: {
  product: ProductIntelligence;
}) {
  const urls = new Set<string>();

  if (product.manufacturerEvidence?.sourceUrl) {
    urls.add(product.manufacturerEvidence.sourceUrl);
  }

  for (const attribute of product.normalization?.attributes ?? []) {
    urls.add(attribute.sourceUrl);
  }

  const sources = [...urls];

  return (
    <Section id="sources" title="Sources">
      {sources.length === 0 ? (
        <p className="text-[15px] text-muted">
          Manufacturer evidence will appear here once a source page is verified.
        </p>
      ) : (
        <ul className="space-y-2">
          {sources.map((url) => (
            <li key={url}>
              <ExternalUrl href={url} />
            </li>
          ))}
        </ul>
      )}
      {product.manufacturerEvidence?.evidenceSummary ? (
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted">
          {product.manufacturerEvidence.evidenceSummary}
        </p>
      ) : null}
    </Section>
  );
}
