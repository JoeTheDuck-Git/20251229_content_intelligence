import { CreativeFeatures } from "./ads";

export interface FeatureMapping {
  normalizedHookType: string;
  pacingCategory: "slow" | "medium" | "fast";
  visualComplexity: "low" | "medium" | "high";
}

export function mapCreativeFeatures(features: CreativeFeatures): FeatureMapping {
  // Normalize hook types into categories
  const hookCategories: Record<string, string> = {
    "Question Hook": "engagement",
    "Problem-Solution": "problem-solving",
    "Story Hook": "narrative",
    "Shock Value": "attention",
  };

  return {
    normalizedHookType: hookCategories[features.hookType] || "other",
    pacingCategory: features.pacing,
    visualComplexity: features.visualDensity,
  };
}

