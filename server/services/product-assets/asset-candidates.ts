export type ImageAssetCandidate = {
    url: string;
    altText: string | null;
  };
  
  export type LinkAssetCandidate = {
    url: string;
    label: string | null;
  };
  
  export type AssetCandidates = {
    images: ImageAssetCandidate[];
    links: LinkAssetCandidate[];
  };