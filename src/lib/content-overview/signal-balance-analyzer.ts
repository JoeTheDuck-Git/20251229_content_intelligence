import { PortfolioMap } from "./portfolio-classifier";
import { AdsPerformanceMetrics } from "@/types/ads";
import { OrganicMomentumState } from "@/types/organic";
import { FatigueAnalysis } from "@/types/fatigue";

export type SignalHealth = "healthy" | "watch" | "risk";

export interface GrowthSignalBalance {
  organicMomentumStrength: {
    status: SignalHealth;
    value: number; // 0-10
    description: string;
  };
  paidDependencyConcentration: {
    status: SignalHealth;
    value: number; // 0-10, higher = more concentrated
    description: string;
  };
  crossPlatformStability: {
    status: SignalHealth;
    value: number; // 0-10
    description: string;
  };
}

/**
 * Analyzes the overall health of the content system
 * Combines signals from portfolio distribution and performance patterns
 */
export function analyzeGrowthSignalBalance(
  portfolio: PortfolioMap,
  allMomentumStates: OrganicMomentumState[],
  allPaidMetrics: AdsPerformanceMetrics[],
  allFatigueData: FatigueAnalysis[]
): GrowthSignalBalance {
  // Organic momentum strength
  const avgMomentumScore =
    allMomentumStates.length > 0
      ? allMomentumStates.reduce((sum, m) => sum + m.velocityScore, 0) /
        allMomentumStates.length
      : 0;

  const organicMomentumStrength = {
    value: avgMomentumScore,
    status: determineHealth(avgMomentumScore, 7, 5),
    description:
      avgMomentumScore > 7
        ? "Strong organic momentum across portfolio with consistent velocity signals."
        : avgMomentumScore > 5
        ? "Moderate organic momentum with room for improvement in velocity patterns."
        : "Weak organic momentum signals detected. Consider focusing on platform-native content strategies.",
  };

  // Paid dependency concentration
  const totalAssets =
    portfolio.organicFirst.length +
    portfolio.paidFirst.length +
    portfolio.dualUse.length +
    portfolio.momentOnly.length;

  const paidDependentAssets = portfolio.paidFirst.length + portfolio.dualUse.length;
  const concentrationRatio = totalAssets > 0 ? paidDependentAssets / totalAssets : 0;
  const concentrationScore = concentrationRatio * 10;

  const paidDependencyConcentration = {
    value: concentrationScore,
    status: determineHealth(10 - concentrationScore, 3, 6), // Inverted: lower concentration is better
    description:
      concentrationRatio > 0.7
        ? "High concentration of paid-dependent assets. Consider diversifying with organic-first strategies."
        : concentrationRatio > 0.4
        ? "Balanced mix of paid and organic assets with moderate dependency risk."
        : "Low paid dependency with strong organic foundation. Healthy portfolio balance.",
  };

  // Cross-platform stability
  const fatiguedCount = allFatigueData.filter((f) => f.status === "fatigued").length;
  const totalPaidAssets = allPaidMetrics.length > 0 ? new Set(allPaidMetrics.map((m) => m.assetId)).size : 1;
  const fatigueRatio = fatiguedCount / totalPaidAssets;
  const stabilityScore = (1 - fatigueRatio) * 10;

  const crossPlatformStability = {
    value: stabilityScore,
    status: determineHealth(stabilityScore, 7, 5),
    description:
      stabilityScore > 7
        ? "High cross-platform stability with minimal fatigue signals across paid channels."
        : stabilityScore > 5
        ? "Moderate stability with some fatigue patterns requiring attention."
        : "Low stability detected with significant fatigue signals. Portfolio refresh recommended.",
  };

  return {
    organicMomentumStrength,
    paidDependencyConcentration,
    crossPlatformStability,
  };
}

function determineHealth(
  value: number,
  healthyThreshold: number,
  watchThreshold: number
): SignalHealth {
  if (value >= healthyThreshold) return "healthy";
  if (value >= watchThreshold) return "watch";
  return "risk";
}

