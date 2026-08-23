import * as cheerio from "cheerio";

import type { AssetCandidates } from "./asset-candidates";
function resolveAssetUrl(
    url: string,
    sourceUrl: string,
  ): string | null {
    try {
      return new URL(url, sourceUrl).href;
    } catch {
      return null;
    }
  }

export async function discoverAssetCandidates(
  sourceUrl: string,
): Promise<AssetCandidates> {
  const response = await fetch(sourceUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch manufacturer page: ${response.status}`,
    );
  }

  const html = await response.text();

  const $ = cheerio.load(html);
  const images: AssetCandidates["images"] = [];

const seenImageUrls = new Set<string>();

$("img").each((_, element) => {
  const rawUrl =
    $(element).attr("src") ??
    $(element).attr("data-src");

  if (!rawUrl) {
    return;
  }

  const resolvedUrl = resolveAssetUrl(
    rawUrl,
    sourceUrl,
  );

  if (!resolvedUrl) {
    return;
  }

  const parsedUrl = new URL(resolvedUrl);

  if (
    parsedUrl.protocol !== "http:" &&
    parsedUrl.protocol !== "https:"
  ) {
    return;
  }

  if (seenImageUrls.has(resolvedUrl)) {
    return;
  }

  seenImageUrls.add(resolvedUrl);

  const altText =
    $(element).attr("alt")?.trim() || null;

  images.push({
    url: resolvedUrl,
    altText,
  });
});
const links: AssetCandidates["links"] = [];

const seenLinkUrls = new Set<string>();

$("a").each((_, element) => {
  const rawUrl = $(element).attr("href");

  if (!rawUrl) {
    return;
  }

  const resolvedUrl = resolveAssetUrl(
    rawUrl,
    sourceUrl,
  );

  if (!resolvedUrl) {
    return;
  }

  const parsedUrl = new URL(resolvedUrl);

  if (
    parsedUrl.protocol !== "http:" &&
    parsedUrl.protocol !== "https:"
  ) {
    return;
  }

  if (seenLinkUrls.has(resolvedUrl)) {
    return;
  }

  seenLinkUrls.add(resolvedUrl);

  const text = $(element)
  .clone()
  .find("style, script, svg")
  .remove()
  .end()
  .text()
  .replace(/\s+/g, " ")
  .trim();
  const label =
    text ||
    $(element).attr("aria-label")?.trim() ||
    $(element).attr("title")?.trim() ||
    null;

  links.push({
    url: resolvedUrl,
    label,
  });
});
return {
    images,
    links,
  };

  // next
}