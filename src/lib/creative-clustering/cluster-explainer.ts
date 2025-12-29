import { CreativeCluster, ClusterAnalysis } from "@/types/clustering";

export function explainCluster(cluster: CreativeCluster): string {
  const hookType = cluster.definingFeatures[0] || "unknown";
  const pacing = cluster.definingFeatures[1] || "unknown";
  const duration = cluster.definingFeatures[2] || "unknown";

  let explanation = `This cluster groups creatives with ${hookType} hooks, ${pacing} pacing, and ${duration} duration. `;

  if (cluster.fatigueRiskLevel === "high") {
    explanation += `Creatives in this cluster show a high tendency to fatigue, likely due to the combination of ${pacing} pacing and ${hookType} hooks. `;
  } else if (cluster.fatigueRiskLevel === "medium") {
    explanation += `This cluster shows moderate fatigue risk, requiring careful monitoring. `;
  } else {
    explanation += `This cluster demonstrates low fatigue risk, indicating stable creative performance. `;
  }

  if (cluster.scaleReliability === "reliable") {
    explanation += `The pattern is reliable for scaling, with consistent performance across creatives.`;
  } else if (cluster.scaleReliability === "moderate") {
    explanation += `Scaling should be approached with caution, as performance varies within this cluster.`;
  } else {
    explanation += `This pattern is unstable for scaling, with inconsistent outcomes.`;
  }

  return explanation;
}

export function generateUsageGuidance(
  cluster: CreativeCluster,
  analysis: ClusterAnalysis
): string[] {
  const guidance: string[] = [];

  if (cluster.fatigueRiskLevel === "low" && cluster.scaleReliability === "reliable") {
    guidance.push("Good for scaling: Low fatigue risk and reliable performance");
    guidance.push("Suitable for long-term campaigns");
  } else if (cluster.fatigueRiskLevel === "medium") {
    guidance.push("Good for testing: Monitor fatigue signals closely");
    guidance.push("Refresh variations before fatigue sets in");
  } else {
    guidance.push("Avoid for long runs: High fatigue risk detected");
    guidance.push("Use for short-term campaigns only");
  }

  if (analysis.averageMetrics.avgROAS > 4) {
    guidance.push("Strong ROAS performance: Consider increasing budget");
  }

  if (analysis.fatigueDistribution.fatigued > analysis.fatigueDistribution.healthy) {
    guidance.push("Warning: More fatigued than healthy creatives in this cluster");
  }

  return guidance;
}

export function enrichClusterWithExplanations(
  cluster: CreativeCluster,
  analysis: ClusterAnalysis
): CreativeCluster {
  return {
    ...cluster,
    explanation: explainCluster(cluster),
    usageGuidance: generateUsageGuidance(cluster, analysis),
  };
}

