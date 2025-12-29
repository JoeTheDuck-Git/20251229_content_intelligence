import { StrategyContext, ConfidenceLevel, Platform } from "@/types/strategy";

export function evaluateConfidence(
  context: StrategyContext,
  platform: Platform
): ConfidenceLevel {
  let confidenceScore = 0;

  // Check data completeness
  const hasFatigueData = !!context.fatigueSummary[platform];
  const hasMetrics = !!context.platformMetrics[platform];

  if (hasFatigueData) confidenceScore += 1;
  if (hasMetrics) confidenceScore += 1;

  // Check pattern stability
  if (context.patternType === "cross_platform_stable") {
    confidenceScore += 1;
  } else if (context.patternType === "platform_sensitive") {
    confidenceScore += 0.5;
  }

  // Check scale reliability
  if (context.scaleReliability === "reliable") {
    confidenceScore += 1;
  } else if (context.scaleReliability === "moderate") {
    confidenceScore += 0.5;
  }

  // Determine confidence level
  if (confidenceScore >= 3) {
    return "high";
  } else if (confidenceScore >= 1.5) {
    return "medium";
  } else {
    return "low";
  }
}

export function evaluateOverallConfidence(
  context: StrategyContext,
  recommendations: Array<{ confidenceLevel: ConfidenceLevel }>
): ConfidenceLevel {
  if (recommendations.length === 0) {
    return "low";
  }

  const confidenceScores = recommendations.map((rec) => {
    switch (rec.confidenceLevel) {
      case "high": return 3;
      case "medium": return 2;
      case "low": return 1;
    }
  });

  const avgScore = confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length;

  if (avgScore >= 2.5) {
    return "high";
  } else if (avgScore >= 1.5) {
    return "medium";
  } else {
    return "low";
  }
}

export function evaluateDataCompleteness(context: StrategyContext): {
  fatigueData: boolean;
  clusterData: boolean;
  multiChannelData: boolean;
} {
  const hasFatigueData = Object.keys(context.fatigueSummary).length > 0;
  const hasClusterData = !!context.clusterId;
  const hasMultiChannelData = Object.keys(context.platformMetrics).length > 1;

  return {
    fatigueData: hasFatigueData,
    clusterData: hasClusterData,
    multiChannelData: hasMultiChannelData,
  };
}

