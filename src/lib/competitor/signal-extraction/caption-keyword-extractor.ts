import { CompetitorContentAsset } from "@/types/competitor";

export function extractKeywords(asset: CompetitorContentAsset): string[] {
  // In real implementation, this would use NLP to extract keywords from captions
  // For demo, return the stored keywords
  return asset.creativeSignals.keywords || [];
}

export function aggregateKeywords(assets: CompetitorContentAsset[]): {
  keyword: string;
  frequency: number;
}[] {
  const keywordCounts: Record<string, number> = {};

  assets.forEach((asset) => {
    const keywords = extractKeywords(asset);
    keywords.forEach((keyword) => {
      keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
    });
  });

  return Object.entries(keywordCounts)
    .map(([keyword, frequency]) => ({ keyword, frequency }))
    .sort((a, b) => b.frequency - a.frequency);
}

