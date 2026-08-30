import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

import { Card } from "@/components/workspace/card";
import { PageHeader } from "@/components/workspace/page-header";
import { ProductHero } from "@/components/workspace/product-hero";
import {
  AssetGallery,
  AttributesTable,
  ClassificationPanel,
  ProductContentPanel,
  ProductIdentityCard,
  ProductSectionNav,
  SourcesPanel,
} from "@/components/workspace/product-panels";
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
  const evidence = product.manufacturerEvidence;
  const title =
    evidence?.productName ??
    product.rawDescription ??
    product.rawMpn ??
    "Product";
  const description =
    product.content?.shortDescription ??
    product.content?.marketingDescription ??
    product.rawDescription;
  const extraIdentity = Boolean(
    evidence?.series || product.rawManufacturerLabel || !evidence,
  );

  return (
    <div>
      <PageHeader
        crumbs={[
          { href: "/products", label: "Catalog" },
          { label: title },
        ]}
        description={`From ${product.importFileName}, row ${product.rowNumber}. Open a section below for classification, copy, and files.`}
      />

      <ProductHero
        importId={product.importId}
        importFileName={product.importFileName}
        rowNumber={product.rowNumber}
        title={title}
        brand={evidence?.brandName ?? null}
        manufacturer={evidence?.manufacturerName ?? null}
        mpn={evidence?.manufacturerPartNumber ?? product.rawMpn}
        productType={evidence?.productType ?? null}
        description={description}
        isReady={product.hasContent}
        needsReview={needsReview}
        confidence={
          product.proposedClassification?.confidence ??
          product.verifiedClassification?.confidence ??
          null
        }
        sourceUrl={evidence?.sourceUrl ?? null}
        images={product.assets?.images ?? []}
        stages={[
          { label: "Uploaded", done: true },
          { label: "Interpreted", done: product.hasInterpretation },
          { label: "Classified", done: product.hasClassification },
          { label: "Enriched", done: product.hasEnrichment },
          { label: "Normalized", done: product.hasNormalization },
          { label: "Content", done: product.hasContent },
          { label: "Assets", done: product.hasAssets },
        ]}
      />

      <div className="mt-6">
        <ProductSectionNav />
        <Card>
          {extraIdentity ? <ProductIdentityCard product={product} /> : null}
          <ClassificationPanel product={product} />
          <AttributesTable product={product} />
          <ProductContentPanel product={product} />
          <AssetGallery product={product} showImages={false} />
          <SourcesPanel product={product} />
        </Card>
      </div>
    </div>
  );
}
