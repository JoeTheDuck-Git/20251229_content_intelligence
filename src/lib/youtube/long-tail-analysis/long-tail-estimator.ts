import { YouTubeRetentionMetrics, LongTailAnalysis } from "@/types/youtube";
import { analyzeRetention, RetentionAnalysis } from "../retention-analysis/retention-analyzer";
import { NarrativeStructure } from "../narrative-analysis/narrative-mapper";

export function estimateLongTailPotential(
  metrics: YouTubeRetentionMetrics,
  retentionAnalysis: RetentionAnalysis,
  narrativeStructure: NarrativeStructure
): LongTailAnalysis {
  const averageRetention = retentionAnalysis.averageRetention;
  const overallTrend = retentionAnalysis.overallTrend;
  const pacingScore = narrativeStructure.pacingScore;
  
  // Calculate long-tail potential score
  let potentialScore = 0;
  
  // High retention = higher potential
  if (averageRetention > 70) {
    potentialScore += 3;
  } else if (averageRetention > 60) {
    potentialScore += 2;
  } else if (averageRetention > 50) {
    potentialScore += 1;
  }
  
  // Improving trend = higher potential
  if (overallTrend === "improving") {
    potentialScore += 2;
  } else if (overallTrend === "stable") {
    potentialScore += 1;
  }
  
  // Good pacing = higher potential
  if (pacingScore >= 8) {
    potentialScore += 2;
  } else if (pacingScore >= 6) {
    potentialScore += 1;
  }
  
  // Strong core retention = higher potential
  const coreInsight = retentionAnalysis.retentionBySegment.find(
    insight => insight.segmentType === "core"
  );
  if (coreInsight && coreInsight.retentionImpact === "positive") {
    potentialScore += 2;
  }
  
  // Determine long-tail potential
  let longTailPotential: "low" | "medium" | "high" = "low";
  if (potentialScore >= 7) {
    longTailPotential = "high";
  } else if (potentialScore >= 4) {
    longTailPotential = "medium";
  }
  
  // Estimate long-tail views (rough calculation)
  const currentViews = metrics.totalWatchTime / metrics.averageWatchTime;
  let estimatedLongTailViews = currentViews;
  
  if (longTailPotential === "high") {
    estimatedLongTailViews = currentViews * 3;
  } else if (longTailPotential === "medium") {
    estimatedLongTailViews = currentViews * 1.5;
  }
  
  // Determine watch time trend
  let watchTimeTrend: "increasing" | "stable" | "decreasing" = "stable";
  if (overallTrend === "improving") {
    watchTimeTrend = "increasing";
  } else if (overallTrend === "declining") {
    watchTimeTrend = "decreasing";
  }
  
  // Generate reasoning
  let reasoning = "";
  if (longTailPotential === "high") {
    reasoning = "Strong retention patterns and narrative pacing support algorithmic discovery. High average retention and improving trend suggest content will continue to gain views over time.";
  } else if (longTailPotential === "medium") {
    reasoning = "Moderate retention patterns indicate some long-tail potential. Content may benefit from optimization to improve retention in key segments.";
  } else {
    reasoning = "Low retention and declining trends suggest limited long-tail potential. Consider restructuring narrative or improving engagement in weak segments.";
  }
  
  return {
    assetId: metrics.assetId,
    longTailPotential,
    estimatedLongTailViews: Math.round(estimatedLongTailViews),
    reasoning,
    watchTimeTrend,
  };
}

