import type { ProductIntelligence } from "@/server/db/queries/workspace";
import { formatDocumentType } from "@/lib/product-display";

import { CopyButton } from "./copy-button";
import { ConfidenceBadge, NeedsReviewBadge } from "./status-badge";

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-surface">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <div className="px-4 py-4">{children}</div>
    </section>
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
      <dt className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="mt-1 flex items-center gap-2 text-sm">
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
      className="inline-flex max-w-full items-center gap-1 text-sm text-accent hover:underline"
    >
      <span className="truncate">{label ?? href}</span>
      <span aria-hidden="true">↗</span>
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
    <Panel title="Product identity">
      <dl className="grid gap-4 sm:grid-cols-2">
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
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Manufacturer source
          </p>
          <div className="mt-1">
            <ExternalUrl href={evidence.sourceUrl} />
          </div>
        </div>
      ) : null}

      {!evidence ? (
        <p className="text-sm text-muted">
          Verified manufacturer identity is not available yet. Source fields
          from the spreadsheet remain separate from verified identity.
        </p>
      ) : null}

      {product.rawManufacturerLabel ? (
        <p className="mt-3 text-xs text-muted">
          Spreadsheet supplier label (not verified manufacturer):{" "}
          {product.rawManufacturerLabel}
        </p>
      ) : null}
    </Panel>
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
    <Panel title="Classification">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Verified classification
          </p>
          {verifiedPath ? (
            <p className="mt-1 text-sm">{verifiedPath}</p>
          ) : (
            <p className="mt-1 text-sm text-muted">
              Verified classification unavailable
            </p>
          )}
          {verified?.needsReview ? (
            <div className="mt-2">
              <NeedsReviewBadge />
            </div>
          ) : null}
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Proposed classification
          </p>
          {proposedPath ? (
            <p className="mt-1 text-sm">{proposedPath}</p>
          ) : (
            <p className="mt-1 text-sm text-muted">Not available</p>
          )}
          <div className="mt-2 flex items-center gap-2">
            <ConfidenceBadge confidence={proposed?.confidence ?? null} />
            {proposed?.needsReview ? <NeedsReviewBadge /> : null}
          </div>
          {proposed?.reason ? (
            <p className="mt-2 text-xs text-muted">{proposed.reason}</p>
          ) : null}
        </div>
      </div>
    </Panel>
  );
}

export function AttributesTable({
  product,
}: {
  product: ProductIntelligence;
}) {
  const attributes = product.normalization?.attributes ?? [];

  return (
    <Panel title="Attributes">
      {attributes.length === 0 ? (
        <p className="text-sm text-muted">No verified attributes yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="pb-2 font-medium">Attribute</th>
                <th className="pb-2 font-medium">Value</th>
                <th className="pb-2 font-medium">UOM</th>
              </tr>
            </thead>
            <tbody>
              {attributes.map((attribute) => (
                <tr key={`${attribute.name}-${attribute.value}`} className="border-t border-border">
                  <td className="py-2">{attribute.name}</td>
                  <td className="py-2">{attribute.value}</td>
                  <td className="py-2 text-muted">{attribute.uom ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
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
    <Panel title="Product content">
      {visible.length === 0 && features.length === 0 ? (
        <p className="text-sm text-muted">Generated content is not available yet.</p>
      ) : (
        <div className="space-y-4">
          {visible.map(([label, value]) => (
            <div key={label}>
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                {label}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{value}</p>
            </div>
          ))}
          {features.length > 0 ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Features
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                {features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </Panel>
  );
}

export function AssetGallery({
  product,
}: {
  product: ProductIntelligence;
}) {
  const images = product.assets?.images ?? [];
  const documents = product.assets?.documents ?? [];
  const videos = product.assets?.videos ?? [];

  return (
    <Panel title="Assets">
      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted">
            Images
          </h3>
          {images.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No manufacturer assets found</p>
          ) : (
            <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
              {images.map((image) => (
                <li key={image.url} className="overflow-hidden rounded-md border border-border">
                  <a href={image.url} target="_blank" rel="noreferrer">
                    {/* Manufacturer image hosts are unbounded, so next/image cannot allowlist them. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt={image.altText ?? "Manufacturer product image"}
                      className="h-28 w-full object-contain bg-surface-muted"
                    />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted">
            Documents
          </h3>
          {documents.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No manufacturer documents found</p>
          ) : (
            <ul className="mt-2 divide-y divide-border">
              {documents.map((document) => (
                <li key={document.url} className="flex items-center justify-between gap-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
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
                    className="shrink-0 text-sm font-medium text-accent hover:underline"
                  >
                    Open ↗
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted">
            Videos
          </h3>
          {videos.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No manufacturer videos found</p>
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
    </Panel>
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
    <Panel title="Sources / evidence">
      {sources.length === 0 ? (
        <p className="text-sm text-muted">
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
        <p className="mt-3 text-sm text-muted">
          {product.manufacturerEvidence.evidenceSummary}
        </p>
      ) : null}
    </Panel>
  );
}

