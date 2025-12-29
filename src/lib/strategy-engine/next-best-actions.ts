import { StrategyOutput, Platform, ConfidenceLevel } from "@/types/strategy";
import { PortfolioMap } from "@/lib/content-overview/portfolio-classifier";
import { GrowthSignalBalance } from "@/lib/content-overview/signal-balance-analyzer";
import { StrategicTension } from "@/lib/content-overview/tension-detector";

export interface NextBestAction {
  id: string;
  title: string; // Verb-first action title
  targetPlatforms: Platform[];
  affectedClusters: string[];
  rationale: string; // Plain English explanation
  confidenceLevel: ConfidenceLevel;
  riskNote?: string;
  priority: "high" | "medium" | "low";
  actionType: "scale" | "pause" | "refresh" | "promote" | "test" | "maintain";
}

/**
 * Generates prioritized next best actions by combining:
 * - Paid Intelligence (fatigue, performance)
 * - Organic Intelligence (momentum, validation)
 * - Multi-Channel Intelligence (cross-platform patterns)
 */
export function generateNextBestActions(
  strategies: StrategyOutput[],
  portfolio: PortfolioMap,
  signalBalance: GrowthSignalBalance,
  tensions: StrategicTension[]
): NextBestAction[] {
  const actions: NextBestAction[] = [];

  // 1. Detect high-priority fatigue actions
  if (strategies && Array.isArray(strategies)) {
    strategies.forEach((strategy) => {
      if (strategy && strategy.recommendations && Array.isArray(strategy.recommendations)) {
        strategy.recommendations.forEach((rec) => {
          if (rec && rec.recommendedAction === "pause" && rec.confidenceLevel === "high") {
            actions.push({
              id: `pause-${strategy.clusterId}-${rec.platform}`,
              title: `Pause scaling on ${rec.platform} for ${strategy.clusterLabel || "Cluster"}`,
              targetPlatforms: [rec.platform],
              affectedClusters: [strategy.clusterId],
              rationale: rec.rationale || "Fatigue detected",
              confidenceLevel: rec.confidenceLevel,
              riskNote: "Continuing to scale fatigued creatives will waste budget and accelerate performance decline.",
              priority: "high",
              actionType: "pause",
            });
          }
        });
      }
    });
  }

  // 2. Organic-to-Paid promotion opportunities
  if (portfolio.organicFirst && Array.isArray(portfolio.organicFirst)) {
    portfolio.organicFirst.forEach((asset) => {
      if (asset && asset.confidence === "high") {
        const platforms: Platform[] = ["Meta", "TikTok"]; // Default platforms for promotion
        actions.push({
          id: `promote-${asset.id}`,
          title: `Promote organic-validated assets into paid testing`,
          targetPlatforms: platforms,
          affectedClusters: [], // Will be determined by clustering
          rationale: `Asset shows strong organic momentum (${asset.reasoning || "N/A"}). This represents validated audience interest that could benefit from paid amplification.`,
          confidenceLevel: asset.confidence === "high" ? "high" : "medium",
          priority: "medium",
          actionType: "promote",
        });
      }
    });
  }

  // 3. Creative refresh recommendations
  if (strategies && Array.isArray(strategies)) {
    strategies.forEach((strategy) => {
      if (strategy && strategy.recommendations && Array.isArray(strategy.recommendations)) {
        strategy.recommendations.forEach((rec) => {
          if (rec && rec.recommendedAction === "refresh_creative") {
            actions.push({
              id: `refresh-${strategy.clusterId}-${rec.platform}`,
              title: `Refresh hooks for ${rec.platform} short-form creatives`,
              targetPlatforms: [rec.platform],
              affectedClusters: [strategy.clusterId],
              rationale: rec.rationale || "Creative refresh needed",
              confidenceLevel: rec.confidenceLevel,
              priority: rec.confidenceLevel === "high" ? "high" : "medium",
              actionType: "refresh",
            });
          }
        });
      }
    });
  }

  // 4. Cross-platform scaling opportunities
  if (strategies && Array.isArray(strategies)) {
    strategies.forEach((strategy) => {
      if (
        strategy &&
        strategy.context &&
        strategy.context.patternType === "cross_platform_stable" &&
        strategy.overallConfidence === "high" &&
        strategy.recommendations &&
        Array.isArray(strategy.recommendations)
      ) {
        const healthyPlatforms = strategy.recommendations
          .filter((r) => r && r.recommendedAction === "scale")
          .map((r) => r.platform)
          .filter((p) => p);

        if (healthyPlatforms.length > 0) {
          actions.push({
            id: `scale-${strategy.clusterId}`,
            title: `Scale cross-platform stable pattern: ${strategy.clusterLabel || "Cluster"}`,
            targetPlatforms: healthyPlatforms,
            affectedClusters: [strategy.clusterId],
            rationale: `This pattern demonstrates stable performance across ${healthyPlatforms.join(", ")}. Safe to scale with continued monitoring.`,
            confidenceLevel: strategy.overallConfidence,
            priority: "medium",
            actionType: "scale",
          });
        }
      }
    });
  }

  // 5. Strategic tension resolutions
  if (tensions && Array.isArray(tensions)) {
    tensions.forEach((tension) => {
      if (tension && tension.severity === "high") {
        actions.push({
          id: `resolve-tension-${tension.id || "unknown"}`,
          title: `Address strategic mismatch: ${tension.title || "Unknown tension"}`,
          targetPlatforms: ["Meta", "TikTok", "YouTube"], // May need platform-specific resolution
          affectedClusters: [],
          rationale: tension.description || "Strategic tension detected",
          confidenceLevel: "medium",
          riskNote: tension.whatToWatch || "Monitor closely",
          priority: "high",
          actionType: "test",
        });
      }
    });
  }

  // 6. Moment-driven content risk control
  if (portfolio.momentOnly && Array.isArray(portfolio.momentOnly)) {
    portfolio.momentOnly.forEach((asset) => {
      if (asset) {
        actions.push({
          id: `control-moment-${asset.id}`,
          title: `Control moment-driven content risk`,
          targetPlatforms: ["TikTok"], // Moment-driven content is often TikTok-focused
          affectedClusters: [],
          rationale: `Asset is aligned with specific moments/trends. High short-term value but limited long-term stability. Monitor for moment expiration.`,
          confidenceLevel: "medium",
          riskNote: "Moment-driven content may experience rapid performance decline when trend expires.",
          priority: "low",
          actionType: "maintain",
        });
      }
    });
  }

  // Sort by priority and confidence
  return actions.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const confidenceOrder = { high: 3, medium: 2, low: 1 };

    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }

    return confidenceOrder[b.confidenceLevel] - confidenceOrder[a.confidenceLevel];
  });
}

