import { CreativeFeatures } from "@/types/ads";
import { categorizeHookType } from "./feature-extraction";

export interface NormalizedFeatures {
  hookCategory: string;
  pacingCategory: "slow" | "medium" | "fast";
  voiceCategory: "voiceover" | "talking-head" | "text-only";
  visualComplexity: "low" | "medium" | "high";
}

export function normalizeCreativeFeatures(
  features: CreativeFeatures
): NormalizedFeatures {
  return {
    hookCategory: categorizeHookType(features.hookType),
    pacingCategory: features.pacing,
    voiceCategory: features.voiceType,
    visualComplexity: features.visualDensity,
  };
}

export function groupSimilarCreatives(
  assets: Array<{ id: string; features: CreativeFeatures }>
): Record<string, string[]> {
  const groups: Record<string, string[]> = {};

  assets.forEach((asset) => {
    const normalized = normalizeCreativeFeatures(asset.features);
    const key = `${normalized.hookCategory}-${normalized.pacingCategory}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(asset.id);
  });

  return groups;
}

