import { AdsCreativeAsset, CreativeFeatures } from "@/types/ads";

export function extractCreativeFeatures(asset: AdsCreativeAsset): CreativeFeatures {
  return asset.creativeFeatures;
}

export function categorizeHookType(hookType: string): string {
  const categories: Record<string, string> = {
    "Question Hook": "engagement",
    "Problem-Solution": "problem-solving",
    "Story Hook": "narrative",
    "Shock Value": "attention",
  };
  return categories[hookType] || "other";
}

export function isHighVisualDensity(visualDensity: string): boolean {
  return visualDensity === "high";
}

export function isFastPaced(pacing: string): boolean {
  return pacing === "fast";
}

