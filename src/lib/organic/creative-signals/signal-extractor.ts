import { OrganicContentAsset, CreativeSignals } from "@/types/organic";

export interface NormalizedSignals {
  hookCategory: string;
  pacingCategory: "slow" | "medium" | "fast" | "unknown";
  visualDominance: string;
  toneCategory: string;
}

export function extractCreativeSignals(
  asset: OrganicContentAsset
): NormalizedSignals {
  const signals = asset.creativeSignals;

  // Normalize hook styles
  const hookCategories: Record<string, string> = {
    "Fast Hook": "attention-grabbing",
    "Story Hook": "narrative",
    "Visual Hook": "visual-first",
    "Question Hook": "engagement",
    "Problem-Solution": "problem-solving",
    "Emotional Hook": "emotional",
    "Trend Hook": "trend-aligned",
    "Educational Hook": "educational",
  };

  // Normalize pacing
  const pacingCategory = signals.pacing || "unknown";

  // Determine visual dominance
  const visualDominanceMap: Record<string, string> = {
    product: "product-centric",
    person: "person-centric",
    scene: "scene-centric",
    text: "text-centric",
  };

  // Normalize emotional tone
  const toneMap: Record<string, string> = {
    informative: "educational",
    entertaining: "engagement-focused",
    inspiring: "emotional-resonance",
  };

  return {
    hookCategory: hookCategories[signals.hookStyle] || "other",
    pacingCategory,
    visualDominance: visualDominanceMap[signals.visualFocus] || "mixed",
    toneCategory: toneMap[signals.emotionalTone] || "neutral",
  };
}

export function getSignalStrength(
  asset: OrganicContentAsset
): "strong" | "moderate" | "weak" {
  const signals = extractCreativeSignals(asset);
  let score = 0;

  // Fast pacing + person focus = strong for TikTok
  if (signals.pacingCategory === "fast" && asset.creativeSignals.visualFocus === "person") {
    score += 2;
  }

  // Story hook + slow pacing = strong for YouTube
  if (signals.hookCategory === "narrative" && signals.pacingCategory === "slow") {
    score += 2;
  }

  // Visual-first + inspiring = strong for Meta
  if (signals.visualDominance === "product-centric" && signals.toneCategory === "emotional-resonance") {
    score += 2;
  }

  if (score >= 2) return "strong";
  if (score === 1) return "moderate";
  return "weak";
}

