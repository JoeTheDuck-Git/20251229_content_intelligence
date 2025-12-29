import {
  PaidTagEfficiency,
  PaidCreativeHealth,
  EfficiencyLevel,
  StabilityLevel,
  ConfidenceLevel,
} from "@/types/creative-performance";
import { AdsCreativeAsset, AdsPerformanceMetrics } from "@/types/ads";
import { FatigueAnalysis } from "@/types/fatigue";
import { normalizeCreativeFeatures } from "@/lib/creative-intelligence/feature-mapping";
import { getMetricsByAssetId } from "@/lib/fatigue-intelligence/get-fatigue-data";

export function analyzePaidCreativeHealth(
  assets: AdsCreativeAsset[],
  metricsMap: Map<string, AdsPerformanceMetrics[]>,
  fatigueMap: Map<string, FatigueAnalysis>
): PaidCreativeHealth {
  let healthyCount = 0;
  let warningCount = 0;
  let fatiguedCount = 0;
  const efficiencyScores: number[] = [];

  assets.forEach((asset) => {
    const fatigue = fatigueMap.get(asset.id);
    if (fatigue) {
      if (fatigue.status === "healthy") healthyCount++;
      else if (fatigue.status === "warning") warningCount++;
      else fatiguedCount++;

      const metrics = metricsMap.get(asset.id) || [];
      if (metrics.length > 0) {
        const avgROAS = metrics.reduce((sum, m) => sum + m.roas, 0) / metrics.length;
        efficiencyScores.push(avgROAS / 5); // Normalize to 0-1
      }
    }
  });

  const overallHealth =
    healthyCount > fatiguedCount + warningCount
      ? "healthy"
      : fatiguedCount > healthyCount
      ? "at-risk"
      : "moderate";

  const efficiencyVariance =
    efficiencyScores.length > 1
      ? Math.max(...efficiencyScores) - Math.min(...efficiencyScores)
      : 0;
  const efficiencyStability: StabilityLevel =
    efficiencyVariance < 0.3 ? "consistent" : "volatile";

  // Concentration risk: if too many assets share same tag
  const tagCounts = new Map<string, number>();
  assets.forEach((asset) => {
    const normalized = normalizeCreativeFeatures(asset.creativeFeatures);
    const tag = normalized.hookCategory;
    tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
  });

  const maxTagCount = Math.max(...Array.from(tagCounts.values()));
  const concentrationRisk =
    maxTagCount > assets.length * 0.5
      ? "high"
      : maxTagCount > assets.length * 0.3
      ? "medium"
      : "low";

  return {
    overallHealth,
    efficiencyStability,
    concentrationRisk,
  };
}

export function analyzePaidTagEfficiency(
  assets: AdsCreativeAsset[],
  metricsMap: Map<string, AdsPerformanceMetrics[]>,
  fatigueMap: Map<string, FatigueAnalysis>
): PaidTagEfficiency[] {
  const tagMap = new Map<string, {
    tagId: string;
    tagName: string;
    roasScores: number[];
    fatigueSensitivities: ("low" | "medium" | "high")[];
    stabilityScores: number[];
    assetCount: number;
  }>();

  assets.forEach((asset) => {
    const normalized = normalizeCreativeFeatures(asset.creativeFeatures);
    const tagId = `hook-${normalized.hookCategory}`;
    const tagName = normalized.hookCategory;

    if (!tagMap.has(tagId)) {
      tagMap.set(tagId, {
        tagId,
        tagName,
        roasScores: [],
        fatigueSensitivities: [],
        stabilityScores: [],
        assetCount: 0,
      });
    }

    const data = tagMap.get(tagId)!;
    data.assetCount++;

    const metrics = metricsMap.get(asset.id) || [];
    if (metrics.length > 0) {
      const avgROAS = metrics.reduce((sum, m) => sum + m.roas, 0) / metrics.length;
      data.roasScores.push(avgROAS);

      // Calculate stability (variance in ROAS over time)
      const roasValues = metrics.map((m) => m.roas);
      const variance =
        roasValues.length > 1
          ? Math.max(...roasValues) - Math.min(...roasValues)
          : 0;
      data.stabilityScores.push(variance);
    }

    const fatigue = fatigueMap.get(asset.id);
    if (fatigue) {
      const sensitivity =
        fatigue.status === "fatigued"
          ? "high"
          : fatigue.status === "warning"
          ? "medium"
          : "low";
      data.fatigueSensitivities.push(sensitivity);
    }
  });

  const results: PaidTagEfficiency[] = [];

  tagMap.forEach((data) => {
    if (data.roasScores.length === 0) return;

    const avgROAS = data.roasScores.reduce((a, b) => a + b, 0) / data.roasScores.length;
    const efficiencyStrength: EfficiencyLevel =
      avgROAS >= 4 ? "high" : avgROAS >= 2.5 ? "medium" : "low";

    const avgStability = data.stabilityScores.reduce((a, b) => a + b, 0) / data.stabilityScores.length;
    const stabilityUnderSpend: StabilityLevel =
      avgStability < 1.0 ? "consistent" : "volatile";

    const highSensitivityCount = data.fatigueSensitivities.filter((s) => s === "high").length;
    const fatigueSensitivity =
      highSensitivityCount > data.fatigueSensitivities.length * 0.5
        ? "high"
        : highSensitivityCount > 0
        ? "medium"
        : "low";

    // Scale reliability: tags that maintain efficiency at higher exposure
    const scaleReliability =
      efficiencyStrength === "high" && stabilityUnderSpend === "consistent"
        ? "reliable"
        : efficiencyStrength === "medium" && fatigueSensitivity === "low"
        ? "moderate"
        : "unreliable";

    const confidence: ConfidenceLevel =
      data.assetCount >= 5 ? "high" : data.assetCount >= 2 ? "medium" : "low";

    results.push({
      tagId: data.tagId,
      tagName: data.tagName,
      efficiencyStrength,
      stabilityUnderSpend,
      fatigueSensitivity,
      scaleReliability,
      confidence,
    });
  });

  return results;
}

