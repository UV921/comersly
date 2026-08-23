import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PageHeader } from "@/components/workspace/page-header";
import { ProductPipeline } from "@/components/workspace/pipeline";
import {
  AssetGallery,
  AttributesTable,
  ClassificationPanel,
  ProductContentPanel,
  ProductIdentityCard,
  SourcesPanel,
} from "@/components/workspace/product-panels";
import { NeedsReviewBadge, ProductStateBadge } from "@/components/workspace/status-badge";
import { getProductIntelligenceForUser } from "@/server/db/queries/workspace";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { itemId } = await params;
  const product = await getProductIntelligenceForUser(itemId, userId);

  if (!product) {
    notFound();
  }

  const needsReview = Boolean(
    product.proposedClassification?.needsReview ||
      product.verifiedClassification?.needsReview,
  );

  return (
    <>
      <div className="mb-4 text-sm text-muted">
        <Link href={`/imports/${product.importId}`} className="hover:text-foreground">
          {product.importFileName}
        </Link>
        <span> / row {product.rowNumber}</span>
      </div>

      <PageHeader
        title={
          product.manufacturerEvidence?.productName ??
          product.rawDescription ??
          product.rawMpn ??
          "Product"
        }
        description="Internal product intelligence. This is not the 252-column delivery spreadsheet."
        actions={
          <div className="flex items-center gap-2">
            <ProductStateBadge isReady={product.hasContent} />
            {needsReview ? <NeedsReviewBadge /> : null}
          </div>
        }
      />

      <div className="mb-6">
        <ProductPipeline
          stages={[
            { label: "Uploaded", done: true },
            { label: "Interpreting", done: product.hasInterpretation },
            { label: "Verification", done: product.hasClassification },
            { label: "Classification", done: product.hasClassification },
            { label: "Enrichment", done: product.hasEnrichment },
            { label: "Normalization", done: product.hasNormalization },
            { label: "Content", done: product.hasContent },
            { label: "Assets", done: product.hasAssets },
            { label: "Ready", done: product.hasContent },
          ]}
        />
      </div>

      <div className="space-y-4">
        <ProductIdentityCard product={product} />
        <ClassificationPanel product={product} />
        <AttributesTable product={product} />
        <ProductContentPanel product={product} />
        <AssetGallery product={product} />
        <SourcesPanel product={product} />
      </div>
    </>
  );
}
