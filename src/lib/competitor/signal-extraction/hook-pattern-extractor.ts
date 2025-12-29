import { CompetitorContentAsset } from "@/types/competitor";

export function extractHookPattern(asset: CompetitorContentAsset): string {
  // In real implementation, this would analyze caption structure and opening lines
  // For demo, return the stored hook style
  return asset.creativeSignals.hookStyle;
}

export function aggregateHookPatterns(assets: CompetitorContentAsset[]): {
  hookStyle: string;
  frequency: number;
}[] {
  const hookCounts: Record<string, number> = {};

  assets.forEach((asset) => {
    const hook = extractHookPattern(asset);
    hookCounts[hook] = (hookCounts[hook] || 0) + 1;
  });

  return Object.entries(hookCounts)
    .map(([hookStyle, frequency]) => ({ hookStyle, frequency }))
    .sort((a, b) => b.frequency - a.frequency);
}

