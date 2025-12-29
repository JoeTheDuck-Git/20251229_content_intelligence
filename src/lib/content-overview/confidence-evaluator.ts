import { PortfolioMap } from "./portfolio-classifier";

export interface ConfidenceAssessment {
  overall: "high" | "medium" | "low";
  dataCompleteness: number; // 0-100
  signalConsistency: number; // 0-100
  strategyReliability: number; // 0-100
  missingSources: string[];
  warnings: string[];
}

/**
 * Evaluates confidence in strategy recommendations based on data completeness
 */
export function evaluateConfidence(
  portfolio: PortfolioMap,
  hasPaidData: boolean,
  hasOrganicData: boolean,
  hasFatigueData: boolean,
  hasMomentumData: boolean,
  hasTrendData: boolean,
  hasYouTubeData: boolean
): ConfidenceAssessment {
  const missingSources: string[] = [];
  const warnings: string[] = [];

  if (!hasPaidData) {
    missingSources.push("Paid Creative Fatigue Intelligence");
    warnings.push("Paid performance signals unavailable. Portfolio classification may be incomplete.");
  }

  if (!hasOrganicData) {
    missingSources.push("Organic Momentum Intelligence");
    warnings.push("Organic momentum signals unavailable. Growth signal balance may be inaccurate.");
  }

  if (!hasFatigueData) {
    missingSources.push("Paid Fatigue Analysis");
    warnings.push("Fatigue data missing. Cross-platform stability assessment may be incomplete.");
  }

  if (!hasMomentumData) {
    missingSources.push("Organic Momentum States");
    warnings.push("Momentum state data missing. Organic-first classification confidence reduced.");
  }

  if (!hasTrendData) {
    missingSources.push("Trend / Moment Intelligence");
    warnings.push("Trend data unavailable. Moment-only classification may be inaccurate.");
  }

  if (!hasYouTubeData) {
    missingSources.push("YouTube Narrative Intelligence");
    warnings.push("YouTube narrative data missing. Platform-specific insights may be incomplete.");
  }

  // Calculate data completeness
  const totalSources = 6;
  const availableSources = totalSources - missingSources.length;
  const dataCompleteness = (availableSources / totalSources) * 100;

  // Signal consistency: based on portfolio classification confidence
  const totalAssets =
    portfolio.organicFirst.length +
    portfolio.paidFirst.length +
    portfolio.dualUse.length +
    portfolio.momentOnly.length;

  let highConfidenceCount = 0;
  if (totalAssets > 0) {
    [
      ...portfolio.organicFirst,
      ...portfolio.paidFirst,
      ...portfolio.dualUse,
      ...portfolio.momentOnly,
    ].forEach((asset) => {
      if (asset.confidence === "high") highConfidenceCount++;
    });
  }

  const signalConsistency =
    totalAssets > 0
      ? (highConfidenceCount / totalAssets) * 100
      : 0;

  // Strategy reliability: combination of completeness and consistency
  const strategyReliability = (dataCompleteness * 0.6 + signalConsistency * 0.4);

  // Overall confidence
  let overall: "high" | "medium" | "low";
  if (strategyReliability >= 70 && missingSources.length <= 1) {
    overall = "high";
  } else if (strategyReliability >= 50 && missingSources.length <= 3) {
    overall = "medium";
  } else {
    overall = "low";
  }

  return {
    overall,
    dataCompleteness,
    signalConsistency,
    strategyReliability,
    missingSources,
    warnings,
  };
}

