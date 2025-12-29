import { StrategyOutput, Platform } from "@/types/strategy";

export type StrategyPosture = "scale" | "maintain" | "test" | "hold";

export interface PlatformStrategy {
  platform: Platform;
  posture: StrategyPosture;
  reasoning: string;
  watchOuts: string[];
  keyMetrics: {
    avgCTR?: number;
    avgROAS?: number;
    fatigueStatus?: "healthy" | "warning" | "fatigued";
  };
}

/**
 * Generates platform-specific strategy recommendations
 * Avoids one-size-fits-all approach
 */
export function generatePlatformStrategies(
  strategies: StrategyOutput[]
): PlatformStrategy[] {
  const platformMap = new Map<Platform, PlatformStrategy>();

  if (!strategies || !Array.isArray(strategies)) {
    return [];
  }

  const platforms: Platform[] = ["Meta", "TikTok", "YouTube"];

  platforms.forEach((platform) => {
    const platformRecommendations = strategies
      .filter((s) => s && s.recommendations && Array.isArray(s.recommendations))
      .flatMap((s) => s.recommendations)
      .filter((r) => r && r.platform === platform);

    if (platformRecommendations.length === 0) {
      return;
    }

    // Determine overall posture
    const scaleCount = platformRecommendations.filter(
      (r) => r.recommendedAction === "scale"
    ).length;
    const pauseCount = platformRecommendations.filter(
      (r) => r.recommendedAction === "pause"
    ).length;
    const refreshCount = platformRecommendations.filter(
      (r) => r.recommendedAction === "refresh_creative"
    ).length;
    const maintainCount = platformRecommendations.filter(
      (r) => r.recommendedAction === "maintain"
    ).length;

    let posture: StrategyPosture;
    let reasoning = "";
    const watchOuts: string[] = [];

    if (pauseCount > scaleCount + maintainCount) {
      posture = "hold";
      reasoning = `Multiple clusters show fatigue on ${platform}. Pause scaling and refresh creatives before resuming.`;
      watchOuts.push("Monitor for further performance decline");
      watchOuts.push("Prepare refresh variations before restarting");
    } else if (scaleCount > pauseCount) {
      posture = "scale";
      reasoning = `Strong performance across multiple clusters on ${platform}. Safe to increase budget allocation.`;
      watchOuts.push("Monitor frequency to prevent overexposure");
      watchOuts.push("Track ROAS stability weekly");
    } else if (refreshCount > 0) {
      posture = "test";
      reasoning = `Creative refresh needed on ${platform}. Test new variations while maintaining successful elements.`;
      watchOuts.push("Reduce frequency during transition");
      watchOuts.push("Monitor new variations for 1-2 weeks");
    } else {
      posture = "maintain";
      reasoning = `Stable performance on ${platform}. Maintain current strategy with continued monitoring.`;
      watchOuts.push("Watch for early fatigue signals");
      watchOuts.push("Prepare backup variations");
    }

    // Aggregate key metrics
    const allMetrics = strategies
      .filter((s) => s && s.context && s.context.platformMetrics)
      .map((s) => s.context.platformMetrics[platform])
      .filter((m) => m !== undefined && m !== null);

    const avgCTR =
      allMetrics.length > 0
        ? allMetrics.reduce((sum, m) => sum + (m?.avgCTR || 0), 0) /
          allMetrics.length
        : undefined;

    const avgROAS =
      allMetrics.length > 0
        ? allMetrics.reduce((sum, m) => sum + (m?.avgROAS || 0), 0) /
          allMetrics.length
        : undefined;

    // Determine fatigue status
    const fatigueStatuses = strategies
      .filter((s) => s && s.context && s.context.fatigueSummary)
      .map((s) => s.context.fatigueSummary[platform])
      .filter((s) => s !== undefined && s !== null);

    let fatigueStatus: "healthy" | "warning" | "fatigued" | undefined;
    if (fatigueStatuses.length > 0) {
      const fatiguedCount = fatigueStatuses.filter((s) => s === "fatigued").length;
      const warningCount = fatigueStatuses.filter((s) => s === "warning").length;

      if (fatiguedCount > warningCount) {
        fatigueStatus = "fatigued";
      } else if (warningCount > 0) {
        fatigueStatus = "warning";
      } else {
        fatigueStatus = "healthy";
      }
    }

    platformMap.set(platform, {
      platform,
      posture,
      reasoning,
      watchOuts,
      keyMetrics: {
        avgCTR,
        avgROAS,
        fatigueStatus,
      },
    });
  });

  return Array.from(platformMap.values());
}

