import { CreativeCluster, ClusterAnalysis } from "@/types/clustering";
import { CreativeSignature } from "@/types/clustering";
import { getLatestMetric, getMetricsByAssetId } from "@/lib/fatigue-intelligence/get-fatigue-data";
import { generateCreativeSignature } from "./creative-signature";
import { demoAdsAssets } from "@/lib/demo-data/ads-assets";
import { InsightSentenceBuilder } from "@/lib/insight-language/insight-sentence-framework";

function generateClusterInsights(
  cluster: CreativeCluster,
  fatigueDistribution: { healthy: number; early_warning: number; fatigued: number },
  metrics: { avgCTR: number; avgROAS: number; avgFrequency: number }
): string[] {
  const insights: string[] = [];
  const total = fatigueDistribution.healthy + fatigueDistribution.early_warning + fatigueDistribution.fatigued;

  if (total === 0) return insights;

  if (cluster.fatigueRiskLevel === "high") {
    const builder = new InsightSentenceBuilder();
    const fatiguePercent = ((fatigueDistribution.fatigued / total) * 100);
    const description = builder
      .metricObservation(
        "Fatigue risk",
        fatiguePercent,
        `${fatiguePercent.toFixed(0)}% of creatives in this cluster show fatigue patterns`
      )
      .temporalStabilityFraming(
        "this cluster",
        "declining",
        "High fatigue risk indicates temporal sensitivity in observed contexts."
      )
      .build();
    insights.push(description);
  }

  if (cluster.scaleReliability === "reliable") {
    const builder = new InsightSentenceBuilder();
    const healthyPercent = ((fatigueDistribution.healthy / total) * 100);
    const description = builder
      .distributionContextFraming(
        "this cluster",
        "paid",
        `${healthyPercent.toFixed(0)}% of creatives maintain healthy performance`
      )
      .temporalStabilityFraming(
        "this cluster",
        "stable",
        "Scale reliability demonstrates consistent stability over time."
      )
      .build();
    insights.push(description);
  }

  if (metrics.avgROAS > 4 && cluster.fatigueRiskLevel === "low") {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .metricObservation(
        "Average ROAS",
        metrics.avgROAS,
        "this cluster demonstrates strong performance patterns"
      )
      .temporalStabilityFraming(
        "this cluster",
        "stable",
        "Low fatigue risk indicates temporal stability in observed contexts."
      )
      .build();
    insights.push(description);
  }

  if (cluster.definingFeatures.includes("fast") && cluster.fatigueRiskLevel === "high") {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .attentionModeFraming(
        "fast-paced creatives in this cluster",
        "rapid_capture",
        "interruptive contexts"
      )
      .temporalStabilityFraming(
        "this cluster",
        "declining",
        "Fast-paced creatives demonstrate temporal sensitivity patterns."
      )
      .build();
    insights.push(description);
  }

  return insights;
}

export function analyzeCluster(cluster: CreativeCluster): ClusterAnalysis {
  // Get signatures for all assets in cluster
  const assets = demoAdsAssets.filter((asset) =>
    cluster.assetIds.includes(asset.id)
  );
  const signatures: CreativeSignature[] = assets.map((asset) =>
    generateCreativeSignature(asset)
  );

  // Calculate fatigue distribution
  const fatigueDistribution = {
    healthy: signatures.filter((s) => s.fatigueStatus === "healthy").length,
    early_warning: signatures.filter(
      (s) => s.fatigueStatus === "early_warning"
    ).length,
    fatigued: signatures.filter((s) => s.fatigueStatus === "fatigued").length,
  };

  // Calculate average metrics
  const metrics = cluster.assetIds
    .map((assetId) => getLatestMetric(assetId))
    .filter((m) => m !== undefined);

  const avgCTR =
    metrics.length > 0
      ? metrics.reduce((sum, m) => sum + m!.ctr, 0) / metrics.length
      : 0;

  const avgROAS =
    metrics.length > 0
      ? metrics.reduce((sum, m) => sum + m!.roas, 0) / metrics.length
      : 0;

  const avgFrequency =
    metrics.length > 0
      ? metrics.reduce((sum, m) => sum + m!.frequency, 0) / metrics.length
      : 0;

  // Generate cluster insights
  const clusterInsights = generateClusterInsights(
    cluster,
    fatigueDistribution,
    { avgCTR, avgROAS, avgFrequency }
  );

  return {
    cluster,
    totalCreatives: cluster.assetIds.length,
    fatigueDistribution,
    averageMetrics: {
      avgCTR,
      avgROAS,
      avgFrequency,
    },
    clusterInsights,
  };
}

