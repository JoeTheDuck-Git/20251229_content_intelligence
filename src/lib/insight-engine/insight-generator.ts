import {
  AdsCreativeAsset,
  AdsPerformanceMetrics,
  CreativeIntelligenceResult,
} from "@/types/ads";
import { Insight, Recommendation } from "@/types/insights";
import { detectFatigue, assessScalePotential, identifyRiskSignals } from "@/lib/performance-intelligence/fatigue-rules";
import { identifyKeyDrivers } from "@/lib/performance-intelligence/performance-rules";
import { InsightSentenceBuilder } from "@/lib/insight-language/insight-sentence-framework";

export function generateCreativeIntelligence(
  asset: AdsCreativeAsset,
  metrics: AdsPerformanceMetrics[]
): CreativeIntelligenceResult {
  const fatigueStatus = detectFatigue(metrics);
  const scalePotential = assessScalePotential(metrics);
  const keyDrivers = identifyKeyDrivers(asset, metrics);
  const riskSignals = identifyRiskSignals(metrics);

  return {
    assetId: asset.id,
    fatigueStatus,
    scalePotential,
    keyDrivers,
    riskSignals,
  };
}

export function generateInsights(
  asset: AdsCreativeAsset,
  metrics: AdsPerformanceMetrics[],
  intelligence: CreativeIntelligenceResult
): Insight[] {
  const insights: Insight[] = [];
  const latest = metrics[metrics.length - 1];

  // Fatigue insights
  if (intelligence.fatigueStatus === "fatigued") {
    const builder = new InsightSentenceBuilder();
    const roasDecline = `ROAS decline from ${metrics[0].roas.toFixed(1)}x to ${latest.roas.toFixed(1)}x`;
    const description = builder
      .fatigueObservation(latest.frequency, roasDecline, "frequency saturation occurs")
      .temporalStabilityFraming(
        "this creative",
        "declining",
        `Performance patterns suggest temporal sensitivity in this context.`
      )
      .build();

    insights.push({
      id: `insight-${asset.id}-fatigue`,
      type: "risk",
      title: "Creative Fatigue Detected",
      description,
      assetId: asset.id,
      priority: "high",
    });
  } else if (intelligence.fatigueStatus === "warning") {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .temporalStabilityFraming(
        "this creative",
        "declining",
        "Performance metrics show early signs of fatigue patterns."
      )
      .build();

    insights.push({
      id: `insight-${asset.id}-warning`,
      type: "warning",
      title: "Early Fatigue Warning",
      description,
      assetId: asset.id,
      priority: "medium",
    });
  }

  // Scale potential insights
  if (intelligence.scalePotential === "high") {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .distributionContextFraming(
        "this creative",
        "paid",
        `stable ROAS (${latest.roas.toFixed(1)}x) and low frequency (${latest.frequency.toFixed(1)}x) are maintained`
      )
      .temporalStabilityFraming(
        "this creative",
        "stable",
        `Performance demonstrates consistent stability over time.`
      )
      .build();

    insights.push({
      id: `insight-${asset.id}-scale`,
      type: "positive",
      title: "High Scale Potential",
      description,
      assetId: asset.id,
      priority: "high",
    });
  } else if (intelligence.scalePotential === "low") {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .temporalStabilityFraming(
        "this creative",
        "recent",
        "Current performance suggests limited scaling opportunity in observed contexts."
      )
      .build();

    insights.push({
      id: `insight-${asset.id}-low-scale`,
      type: "warning",
      title: "Limited Scale Potential",
      description,
      assetId: asset.id,
      priority: "medium",
    });
  }

  // Performance pattern insights
  if (latest.ctr > 5 && latest.roas < 3) {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .conversionGapObservation(latest.ctr, latest.roas, "post-click alignment factors differ")
      .build();

    insights.push({
      id: `insight-${asset.id}-conversion-mismatch`,
      type: "warning",
      title: "High Engagement, Low Conversion",
      description,
      assetId: asset.id,
      priority: "high",
    });
  }

  // Key drivers insights
  intelligence.keyDrivers.forEach((driver, idx) => {
    insights.push({
      id: `insight-${asset.id}-driver-${idx}`,
      type: "positive",
      title: "Performance Driver",
      description: driver,
      assetId: asset.id,
      priority: "medium",
    });
  });

  return insights;
}

export function generateRecommendations(
  asset: AdsCreativeAsset,
  metrics: AdsPerformanceMetrics[],
  intelligence: CreativeIntelligenceResult
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const latest = metrics[metrics.length - 1];

  if (intelligence.fatigueStatus === "fatigued") {
    recommendations.push({
      assetId: asset.id,
      category: "refresh",
      title: "Refresh Creative",
      description: "Creative shows fatigue. Create new variations while maintaining successful elements.",
      actions: [
        "Test new hook types while keeping successful pacing",
        "Reduce frequency by 30%",
        "Create 3-5 new variations",
      ],
    });
  }

  if (intelligence.scalePotential === "high") {
    recommendations.push({
      assetId: asset.id,
      category: "scaling",
      title: "Scale Budget",
      description: "Creative is ready for budget scaling with continued monitoring.",
      actions: [
        "Increase daily budget by 20-30%",
        "Monitor frequency to stay below 3x",
        "Track ROAS stability weekly",
      ],
    });
  }

  if (latest.ctr > 5 && latest.roas < 3) {
    recommendations.push({
      assetId: asset.id,
      category: "optimization",
      title: "Optimize Conversion Funnel",
      description: "Focus on post-click optimization to improve ROAS.",
      actions: [
        "Review landing page alignment with ad creative",
        "Test different offers or CTAs",
        "Optimize conversion flow",
      ],
    });
  }

  return recommendations;
}

