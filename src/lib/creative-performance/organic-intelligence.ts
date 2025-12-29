import {
  OrganicTagResonance,
  OrganicResonanceHealth,
  StrengthLevel,
  StabilityLevel,
  ConfidenceLevel,
} from "@/types/creative-performance";
import { OrganicContentAsset, OrganicPerformanceMetrics, OrganicMomentumState } from "@/types/organic";
import { extractCreativeSignals } from "@/lib/organic/creative-signals/signal-extractor";

export function analyzeOrganicResonanceHealth(
  assets: OrganicContentAsset[],
  metricsMap: Map<string, OrganicPerformanceMetrics[]>,
  momentumMap: Map<string, OrganicMomentumState>
): OrganicResonanceHealth {
  const resonanceScores: number[] = [];
  const momentumTypes: string[] = [];

  assets.forEach((asset) => {
    const momentum = momentumMap.get(asset.id);
    if (momentum) {
      resonanceScores.push(momentum.resonanceScore / 10); // Normalize to 0-1
      momentumTypes.push(momentum.momentumType);
    }
  });

  const avgResonance =
    resonanceScores.length > 0
      ? resonanceScores.reduce((a, b) => a + b, 0) / resonanceScores.length
      : 0.5;

  const overallStrength: StrengthLevel =
    avgResonance >= 0.7 ? "strong" : avgResonance >= 0.5 ? "mixed" : "weak";

  // Momentum stability: check variance in momentum types
  const uniqueMomentumTypes = new Set(momentumTypes);
  const momentumStability: StabilityLevel =
    uniqueMomentumTypes.size <= 2 ? "consistent" : "volatile";

  // Long-tail potential: count evergreen vs moment-driven
  const longTailCount = momentumTypes.filter(
    (t) => t === "steady_growth" || t === "viral_candidate"
  ).length;
  const longTailPotential =
    longTailCount > momentumTypes.length * 0.6
      ? "strong"
      : longTailCount > momentumTypes.length * 0.3
      ? "moderate"
      : "weak";

  return {
    overallStrength,
    momentumStability,
    longTailPotential,
  };
}

export function analyzeOrganicTagResonance(
  assets: OrganicContentAsset[],
  metricsMap: Map<string, OrganicPerformanceMetrics[]>,
  momentumMap: Map<string, OrganicMomentumState>
): OrganicTagResonance[] {
  const tagMap = new Map<string, {
    tagId: string;
    tagName: string;
    resonanceScores: number[];
    momentumTypes: string[];
    velocityScores: number[];
    assetCount: number;
  }>();

  assets.forEach((asset) => {
    const signals = extractCreativeSignals(asset);
    const tagId = `hook-${signals.hookCategory}`;
    const tagName = signals.hookCategory;

    if (!tagMap.has(tagId)) {
      tagMap.set(tagId, {
        tagId,
        tagName,
        resonanceScores: [],
        momentumTypes: [],
        velocityScores: [],
        assetCount: 0,
      });
    }

    const data = tagMap.get(tagId)!;
    data.assetCount++;

    const momentum = momentumMap.get(asset.id);
    if (momentum) {
      data.resonanceScores.push(momentum.resonanceScore / 10);
      data.momentumTypes.push(momentum.momentumType);
      data.velocityScores.push(momentum.velocityScore / 10);
    }
  });

  const results: OrganicTagResonance[] = [];

  tagMap.forEach((data) => {
    if (data.resonanceScores.length === 0) return;

    const avgResonance =
      data.resonanceScores.reduce((a, b) => a + b, 0) / data.resonanceScores.length;
    const engagementStrength: StrengthLevel =
      avgResonance >= 0.7 ? "strong" : avgResonance >= 0.5 ? "mixed" : "weak";

    // Momentum consistency
    const uniqueMomentumTypes = new Set(data.momentumTypes);
    const momentumConsistency: StabilityLevel =
      uniqueMomentumTypes.size <= 2 ? "consistent" : "volatile";

    // Long-tail signal: steady_growth or viral_candidate indicate long-tail
    const longTailCount = data.momentumTypes.filter(
      (t) => t === "steady_growth" || t === "viral_candidate"
    ).length;
    const longTailSignal =
      longTailCount > data.momentumTypes.length * 0.6
        ? "strong"
        : longTailCount > 0
        ? "moderate"
        : "weak";

    // Moment-driven vs evergreen
    const momentDrivenCount = data.momentumTypes.filter(
      (t) => t === "organic_spike" || t === "decaying"
    ).length;
    const momentDriven = momentDrivenCount > data.momentumTypes.length * 0.5;
    const evergreenPotential = longTailCount > data.momentumTypes.length * 0.4;

    const confidence: ConfidenceLevel =
      data.assetCount >= 5 ? "high" : data.assetCount >= 2 ? "medium" : "low";

    results.push({
      tagId: data.tagId,
      tagName: data.tagName,
      engagementStrength,
      momentumConsistency,
      longTailSignal,
      momentDriven,
      evergreenPotential,
      confidence,
    });
  });

  return results;
}

