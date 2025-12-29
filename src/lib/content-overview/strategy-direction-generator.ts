import { PortfolioMap } from "./portfolio-classifier";
import { GrowthSignalBalance } from "./signal-balance-analyzer";
import { StrategicTension } from "./tension-detector";

export interface StrategyDirection {
  primaryFocus: string;
  secondaryActions: string[];
  riskMitigation: string[];
}

/**
 * Generates plain-English strategic guidance based on portfolio analysis
 */
export function generateStrategyDirection(
  portfolio: PortfolioMap,
  signalBalance: GrowthSignalBalance,
  tensions: StrategicTension[]
): StrategyDirection {
  const totalAssets =
    portfolio.organicFirst.length +
    portfolio.paidFirst.length +
    portfolio.dualUse.length +
    portfolio.momentOnly.length;

  const actions: string[] = [];
  const risks: string[] = [];

  // Primary focus determination
  let primaryFocus = "";

  // Check for organic validation priority
  if (
    portfolio.paidFirst.length > totalAssets * 0.4 &&
    signalBalance.organicMomentumStrength.status === "risk"
  ) {
    primaryFocus =
      "Prioritize organic validation before scaling paid. Build organic-first content to reduce paid dependency and identify naturally resonant creative patterns.";
    actions.push("Develop 3-5 organic-first assets with platform-native hooks");
    actions.push("Test organic performance for 7-14 days before paid amplification");
  }
  // Check for cross-platform stability
  else if (
    signalBalance.crossPlatformStability.status === "risk" ||
    portfolio.momentOnly.length > totalAssets * 0.3
  ) {
    primaryFocus =
      "Shift focus to cross-platform stable creative patterns. Reduce moment dependency and invest in evergreen narratives that perform across multiple channels.";
    actions.push("Identify top-performing dual-use assets and extract their creative patterns");
    actions.push("Reduce moment-only content production by 30-40%");
    actions.push("Develop content templates based on stable cross-platform patterns");
  }
  // Check for paid amplification opportunity
  else if (
    portfolio.organicFirst.length > totalAssets * 0.3 &&
    signalBalance.organicMomentumStrength.status === "healthy"
  ) {
    primaryFocus =
      "Amplify proven organic content through paid channels. Scale assets with strong organic momentum using targeted paid amplification strategies.";
    actions.push("Identify top 3 organic-first assets with sustained momentum (>7 days)");
    actions.push("Test paid amplification with 20-30% of current paid budget");
    actions.push("Monitor ROAS and fatigue signals during amplification phase");
  }
  // Default: Balanced optimization
  else {
    primaryFocus =
      "Optimize existing portfolio balance. Focus on maintaining healthy signal distribution while addressing specific tension points.";
    actions.push("Review strategic tension indicators and prioritize highest-severity items");
    actions.push("Maintain current organic/paid balance while improving individual asset performance");
  }

  // Risk mitigation based on tensions
  const highSeverityTensions = tensions.filter((t) => t.severity === "high");
  if (highSeverityTensions.length > 0) {
    risks.push(
      `Address ${highSeverityTensions.length} high-severity strategic tension${highSeverityTensions.length > 1 ? "s" : ""} within next 14 days`
    );
  }

  if (signalBalance.paidDependencyConcentration.status === "risk") {
    risks.push("Reduce paid dependency concentration by developing organic-first content pipeline");
  }

  if (signalBalance.crossPlatformStability.status === "risk") {
    risks.push("Implement portfolio refresh cycle to address fatigue concentration");
  }

  return {
    primaryFocus,
    secondaryActions: actions.slice(1), // All actions except primary
    riskMitigation: risks,
  };
}

