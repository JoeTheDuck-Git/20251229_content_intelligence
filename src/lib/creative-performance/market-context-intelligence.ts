import {
  CompetitorSignal,
  PaidMarketSignal,
  OrganicMarketSignal,
  MarketPresence,
  MarketSaturation,
  MarketUsage,
  ConfidenceLevel,
} from "@/types/creative-performance";
import { CompetitorContentAsset } from "@/types/competitor";
import { CrossFormatTagPerformance } from "@/types/creative-performance";
import { PaidTagEfficiency } from "@/types/creative-performance";
import { OrganicTagResonance } from "@/types/creative-performance";

// Normalize competitor hook styles to match internal tag categories
function normalizeCompetitorHook(hookStyle: string): string {
  const hookMap: Record<string, string> = {
    "Question Hook": "engagement",
    "Problem-Solution": "problem-solving",
    "Story Hook": "narrative",
    "Shock Value": "attention",
    "Lifestyle Showcase": "lifestyle",
    "Quick Transformation": "transformation",
    "Story-Driven": "narrative",
    "Fast Hook": "attention-grabbing",
  };

  for (const [key, value] of Object.entries(hookMap)) {
    if (hookStyle.includes(key) || hookStyle.toLowerCase().includes(value)) {
      return value;
    }
  }

  // Fallback: extract category from hook style
  if (hookStyle.toLowerCase().includes("question")) return "engagement";
  if (hookStyle.toLowerCase().includes("problem")) return "problem-solving";
  if (hookStyle.toLowerCase().includes("story") || hookStyle.toLowerCase().includes("narrative")) return "narrative";
  return "other";
}

// Calculate market presence based on competitor usage vs internal usage
function calculateMarketPresence(
  competitorFrequency: number,
  totalCompetitorAssets: number,
  internalFrequency: number,
  totalInternalAssets: number
): MarketPresence {
  const competitorPercentage = (competitorFrequency / totalCompetitorAssets) * 100;
  const internalPercentage = (internalFrequency / totalInternalAssets) * 100;

  const ratio = competitorPercentage / (internalPercentage || 0.1);

  if (ratio < 0.7) return "underrepresented";
  if (ratio > 1.3) return "overrepresented";
  return "aligned";
}

export function analyzeCrossFormatMarketContext(
  tagPerformance: CrossFormatTagPerformance[],
  competitorAssets: CompetitorContentAsset[]
): CompetitorSignal[] {
  const totalCompetitorAssets = competitorAssets.length;
  const totalInternalAssets = tagPerformance.reduce(
    (sum, tag) => sum + tag.formatStrengths.length,
    0
  );

  const competitorTagCounts = new Map<string, number>();
  competitorAssets.forEach((asset) => {
    const normalizedHook = normalizeCompetitorHook(asset.creativeSignals.hookStyle);
    competitorTagCounts.set(normalizedHook, (competitorTagCounts.get(normalizedHook) || 0) + 1);
  });

  const signals: CompetitorSignal[] = [];

  tagPerformance.forEach((tag) => {
    const competitorCount = competitorTagCounts.get(tag.tagName) || 0;
    const internalCount = tag.formatStrengths.length;

    const marketPresence = calculateMarketPresence(
      competitorCount,
      totalCompetitorAssets,
      internalCount,
      totalInternalAssets
    );

    let explanation = "";
    if (marketPresence === "overrepresented") {
      explanation = `This creative element appears frequently across competitor creatives.`;
    } else if (marketPresence === "aligned") {
      explanation = `This creative element appears at similar frequency in competitor content.`;
    } else {
      explanation = `This creative element appears less frequently in competitor creatives.`;
    }

    const confidence: ConfidenceLevel =
      competitorCount >= 10 ? "high" : competitorCount >= 5 ? "medium" : "low";

    signals.push({
      tagType: "hook",
      tagName: tag.tagName,
      marketPresence,
      confidence,
      contextualExplanation: explanation,
    });
  });

  return signals;
}

export function analyzePaidMarketContext(
  tagEfficiency: PaidTagEfficiency[],
  competitorAssets: CompetitorContentAsset[]
): PaidMarketSignal[] {
  const totalCompetitorAssets = competitorAssets.length;
  const competitorTagCounts = new Map<string, number>();

  competitorAssets.forEach((asset) => {
    const normalizedHook = normalizeCompetitorHook(asset.creativeSignals.hookStyle);
    competitorTagCounts.set(normalizedHook, (competitorTagCounts.get(normalizedHook) || 0) + 1);
  });

  const signals: PaidMarketSignal[] = [];

  tagEfficiency.forEach((tag) => {
    const competitorCount = competitorTagCounts.get(tag.tagName) || 0;
    const percentage = (competitorCount / totalCompetitorAssets) * 100;

    let marketSaturation: MarketSaturation;
    let explanation = "";

    if (percentage >= 30) {
      marketSaturation = "saturated";
      explanation = `This hook style is widely used in competitor paid creatives.`;
    } else if (percentage >= 15) {
      marketSaturation = "common";
      explanation = `This hook style appears regularly in competitor paid creatives.`;
    } else {
      marketSaturation = "lightly used";
      explanation = `This hook style appears infrequently in competitor paid creatives.`;
    }

    const confidence: ConfidenceLevel =
      competitorCount >= 10 ? "high" : competitorCount >= 5 ? "medium" : "low";

    signals.push({
      tagId: tag.tagId,
      tagName: tag.tagName,
      marketSaturation,
      confidence,
      explanation,
    });
  });

  return signals;
}

export function analyzeOrganicMarketContext(
  tagResonance: OrganicTagResonance[],
  competitorAssets: CompetitorContentAsset[]
): OrganicMarketSignal[] {
  const totalCompetitorAssets = competitorAssets.length;
  const competitorTagCounts = new Map<string, number>();

  competitorAssets.forEach((asset) => {
    const normalizedHook = normalizeCompetitorHook(asset.creativeSignals.hookStyle);
    competitorTagCounts.set(normalizedHook, (competitorTagCounts.get(normalizedHook) || 0) + 1);
  });

  const signals: OrganicMarketSignal[] = [];

  tagResonance.forEach((tag) => {
    const competitorCount = competitorTagCounts.get(tag.tagName) || 0;
    const percentage = (competitorCount / totalCompetitorAssets) * 100;

    let marketUsage: MarketUsage;
    let explanation = "";

    if (percentage >= 25) {
      marketUsage = "heavily used";
      explanation = `This storytelling pattern is increasingly common in competitor organic content.`;
    } else if (percentage >= 10) {
      marketUsage = "typical";
      explanation = `This storytelling pattern appears regularly in competitor organic content.`;
    } else {
      marketUsage = "rare";
      explanation = `This storytelling pattern appears infrequently in competitor organic content.`;
    }

    const confidence: ConfidenceLevel =
      competitorCount >= 10 ? "high" : competitorCount >= 5 ? "medium" : "low";

    signals.push({
      tagId: tag.tagId,
      tagName: tag.tagName,
      marketUsage,
      confidence,
      explanation,
    });
  });

  return signals;
}

