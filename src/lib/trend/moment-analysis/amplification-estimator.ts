import { OrganicPerformanceMetrics } from "@/types/organic";
import { MomentAlignmentResult, MomentContext } from "@/types/trend";
import { analyzeVelocity } from "@/lib/organic/momentum-intelligence/velocity-analyzer";

export interface AmplificationEstimate {
  assetId: string;
  momentId: string;
  baselinePerformance: number;
  actualPerformance: number;
  estimatedMomentContribution: number;
  confidence: "high" | "medium" | "low";
}

export function estimateAmplificationImpact(
  metrics: OrganicPerformanceMetrics[],
  alignment: MomentAlignmentResult,
  moment: MomentContext
): AmplificationEstimate {
  const velocityAnalysis = analyzeVelocity(metrics);
  const latest = metrics[metrics.length - 1];
  
  // Calculate baseline (average of first few data points if available)
  let baselinePerformance = latest.engagementVelocity;
  if (metrics.length >= 2) {
    const earlyMetrics = metrics.slice(0, Math.min(3, metrics.length));
    baselinePerformance = 
      earlyMetrics.reduce((sum, m) => sum + m.engagementVelocity, 0) / earlyMetrics.length;
  }
  
  const actualPerformance = velocityAnalysis.averageVelocity;
  
  // Estimate moment contribution based on alignment strength and intensity
  let estimatedMomentContribution = 0;
  const intensityMultiplier = {
    high: 1.0,
    medium: 0.6,
    low: 0.3,
  }[moment.intensityLevel];
  
  const alignmentMultiplier = {
    strong: 1.0,
    weak: 0.5,
    none: 0,
  }[alignment.alignmentStrength];
  
  const performanceDelta = actualPerformance - baselinePerformance;
  estimatedMomentContribution = performanceDelta * intensityMultiplier * alignmentMultiplier;
  
  // Confidence based on data quality and alignment clarity
  let confidence: "high" | "medium" | "low" = "low";
  if (metrics.length >= 3 && alignment.alignmentStrength === "strong") {
    confidence = "high";
  } else if (metrics.length >= 2 && alignment.alignmentStrength !== "none") {
    confidence = "medium";
  }
  
  return {
    assetId: alignment.assetId,
    momentId: alignment.momentId,
    baselinePerformance,
    actualPerformance,
    estimatedMomentContribution,
    confidence,
  };
}

