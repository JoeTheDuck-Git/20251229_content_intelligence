import { StrategyContext, StrategyRecommendation, Platform, RecommendedAction } from "@/types/strategy";

export function evaluateStrategyRules(
  context: StrategyContext,
  platform: Platform
): RecommendedAction {
  const fatigueStatus = context.fatigueSummary[platform];
  const metrics = context.platformMetrics[platform];

  // Rule 1: Cross-platform stable + low fatigue → scale
  if (
    context.patternType === "cross_platform_stable" &&
    fatigueStatus === "healthy" &&
    context.scaleReliability === "reliable"
  ) {
    return "scale";
  }

  // Rule 2: Platform-specific + fatigue → pause
  if (
    context.patternType === "platform_specific" &&
    fatigueStatus === "fatigued"
  ) {
    return "pause";
  }

  // Rule 3: Platform-sensitive + fatigue on this platform → refresh
  if (
    context.patternType === "platform_sensitive" &&
    fatigueStatus === "fatigued"
  ) {
    return "refresh_creative";
  }

  // Rule 4: High CTR + low ROAS → refresh conversion-focused
  if (metrics && metrics.avgCTR > 5 && metrics.avgROAS < 3) {
    return "refresh_creative";
  }

  // Rule 5: Early warning + reliable scale → maintain
  if (
    fatigueStatus === "warning" &&
    context.scaleReliability === "reliable"
  ) {
    return "maintain";
  }

  // Rule 6: Healthy + moderate reliability → maintain
  if (
    fatigueStatus === "healthy" &&
    context.scaleReliability === "moderate"
  ) {
    return "maintain";
  }

  // Default: maintain
  return "maintain";
}

export function generateRationale(
  context: StrategyContext,
  platform: Platform,
  action: RecommendedAction
): string {
  const fatigueStatus = context.fatigueSummary[platform];
  const metrics = context.platformMetrics[platform];

  switch (action) {
    case "scale":
      return `This pattern is stable across platforms with healthy performance on ${platform}. Safe to scale budget with continued monitoring.`;
    
    case "pause":
      return `Creative fatigue detected on ${platform}. Performance decline indicates audience saturation. Pause spending to prevent further waste.`;
    
    case "refresh_creative":
      if (metrics && metrics.avgCTR > 5 && metrics.avgROAS < 3) {
        return `High CTR (${metrics.avgCTR.toFixed(1)}%) but low ROAS (${metrics.avgROAS.toFixed(1)}x) on ${platform} suggests conversion mismatch. Refresh creative to improve post-click performance.`;
      }
      return `Fatigue signals detected on ${platform}. Refresh creative while maintaining successful elements from this cluster.`;
    
    case "maintain":
      if (fatigueStatus === "warning") {
        return `Early warning signs on ${platform}. Maintain current spend level and monitor closely for fatigue progression.`;
      }
      return `Performance is stable on ${platform}. Maintain current strategy while monitoring for changes.`;
    
    default:
      return `No specific recommendation for ${platform} at this time.`;
  }
}

