import { StrategyContext, StrategyRecommendation, Platform, ConfidenceLevel } from "@/types/strategy";
import { evaluateStrategyRules, generateRationale } from "./strategy-rules";
import { evaluateConfidence } from "./confidence-evaluator";

export function generateCreativeGuidance(
  context: StrategyContext,
  platform: Platform,
  action: string
): string[] {
  const guidance: string[] = [];
  const metrics = context.platformMetrics[platform];

  switch (action) {
    case "scale":
      guidance.push("Increase daily budget by 20-30%");
      guidance.push("Monitor frequency to stay below 3x");
      guidance.push("Track ROAS stability weekly");
      break;

    case "refresh_creative":
      if (metrics && metrics.avgCTR > 5 && metrics.avgROAS < 3) {
        guidance.push("Focus on conversion optimization in new creative");
        guidance.push("Test different CTAs and offers");
        guidance.push("Review landing page alignment");
      } else {
        guidance.push("Test new hook types while keeping successful pacing");
        guidance.push("Reduce frequency by 30% during refresh");
        guidance.push("Create 3-5 new variations");
      }
      break;

    case "pause":
      guidance.push("Stop new spend immediately");
      guidance.push("Analyze what worked before fatigue");
      guidance.push("Prepare refresh variations before restarting");
      break;

    case "maintain":
      guidance.push("Keep current budget level");
      guidance.push("Monitor fatigue signals weekly");
      guidance.push("Prepare refresh variations as backup");
      break;
  }

  // Platform-specific guidance
  if (platform === "TikTok") {
    guidance.push("TikTok: Focus on fast-paced, attention-grabbing hooks");
  } else if (platform === "Meta") {
    guidance.push("Meta: Optimize for shorter formats (15-30s)");
  } else if (platform === "YouTube") {
    guidance.push("YouTube: Allow for longer storytelling (45-60s)");
  }

  return guidance;
}

export function generateTraceableIntelligence(
  context: StrategyContext,
  platform: Platform,
  action: string
): string[] {
  const traces: string[] = [];
  const fatigueStatus = context.fatigueSummary[platform];

  traces.push(`Cluster pattern type: ${context.patternType}`);
  
  if (fatigueStatus) {
    traces.push(`Fatigue status on ${platform}: ${fatigueStatus}`);
  }

  traces.push(`Scale reliability: ${context.scaleReliability}`);

  const metrics = context.platformMetrics[platform];
  if (metrics) {
    traces.push(`Average CTR: ${metrics.avgCTR.toFixed(1)}%`);
    traces.push(`Average ROAS: ${metrics.avgROAS.toFixed(1)}x`);
  }

  return traces;
}

export function generateRecommendations(
  context: StrategyContext
): StrategyRecommendation[] {
  const recommendations: StrategyRecommendation[] = [];
  const platforms: Platform[] = ["Meta", "TikTok", "YouTube"];

  platforms.forEach((platform) => {
    // Only generate recommendation if we have data for this platform
    if (context.fatigueSummary[platform] || context.platformMetrics[platform]) {
      const action = evaluateStrategyRules(context, platform);
      const rationale = generateRationale(context, platform, action);
      const creativeGuidance = generateCreativeGuidance(context, platform, action);
      const traceableIntelligence = generateTraceableIntelligence(context, platform, action);
      const confidenceLevel = evaluateConfidence(context, platform);

      recommendations.push({
        platform,
        recommendedAction: action,
        rationale,
        creativeGuidance,
        confidenceLevel,
        traceableIntelligence,
      });
    }
  });

  return recommendations;
}

