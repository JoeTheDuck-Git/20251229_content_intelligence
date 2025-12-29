import { CrossFormatCapability, CrossFormatTagPerformance } from "@/types/creative-performance";
import { MarketContextAnalysis, CompetitorSignal } from "@/types/competitor";
import { PortfolioMap } from "./portfolio-classifier";
import { GrowthSignalBalance } from "./signal-balance-analyzer";
import { StrategicTension } from "./tension-detector";

export interface StrategicPositioningStatement {
  statement: string;
  confidence: "high" | "medium" | "low";
}

export interface DirectionalFocusArea {
  category: "leverage" | "caution" | "observation";
  description: string;
}

/**
 * Generates strategic positioning statements based on internal capabilities and market context
 */
export function generateStrategicPositioning(
  crossFormatCapability: CrossFormatCapability,
  marketContext: MarketContextAnalysis,
  portfolio: PortfolioMap,
  signalBalance: GrowthSignalBalance
): StrategicPositioningStatement[] {
  const statements: StrategicPositioningStatement[] = [];

  // Video-led positioning
  if (crossFormatCapability.videoStrength === "strong") {
    statements.push({
      statement: "The organization is well-positioned to leverage video-led narratives.",
      confidence: "high",
    });
  }

  // Differentiation vs imitation
  if (marketContext.overallAlignment === "divergent" && marketContext.underrepresentedTags.length > 0) {
    statements.push({
      statement: "Current strengths favor differentiation over imitation.",
      confidence: "high",
    });
  } else if (marketContext.overallAlignment === "crowded") {
    statements.push({
      statement: "Execution risk may increase in saturated creative territories.",
      confidence: "medium",
    });
  }

  // Cross-platform stability
  if (signalBalance.crossPlatformStability.status === "healthy") {
    statements.push({
      statement: "Creative patterns demonstrate cross-platform stability.",
      confidence: "high",
    });
  } else if (signalBalance.crossPlatformStability.status === "risk") {
    statements.push({
      statement: "Platform-specific dependencies may limit strategic flexibility.",
      confidence: "medium",
    });
  }

  // Organic validation
  if (portfolio.organicFirst.length > portfolio.paidFirst.length) {
    statements.push({
      statement: "Organic validation precedes paid amplification in current portfolio.",
      confidence: "high",
    });
  }

  // Capability stability
  if (crossFormatCapability.overallStability === "consistent") {
    statements.push({
      statement: "Internal creative capability shows consistent patterns across formats.",
      confidence: "high",
    });
  }

  return statements;
}

/**
 * Generates directional focus areas (non-actionable)
 */
export function generateDirectionalFocus(
  crossFormatCapability: CrossFormatCapability,
  marketContext: MarketContextAnalysis,
  portfolio: PortfolioMap,
  signalBalance: GrowthSignalBalance,
  tensions: StrategicTension[]
): DirectionalFocusArea[] {
  const areas: DirectionalFocusArea[] = [];

  // Strategic leverage areas
  if (crossFormatCapability.videoStrength === "strong") {
    areas.push({
      category: "leverage",
      description: "Video format demonstrates consistent internal performance signals.",
    });
  }

  if (marketContext.underrepresentedTags.length > 0) {
    areas.push({
      category: "leverage",
      description: "Differentiated creative patterns show less market saturation.",
    });
  }

  if (portfolio.dualUse.length > 0) {
    areas.push({
      category: "leverage",
      description: "Cross-platform creative patterns present strategic leverage opportunities.",
    });
  }

  // Strategic caution areas
  if (marketContext.saturationRisk === "high") {
    areas.push({
      category: "caution",
      description: "Market context indicates increased competition in core creative territories.",
    });
  }

  if (signalBalance.paidDependencyConcentration.status === "risk") {
    areas.push({
      category: "caution",
      description: "High concentration of paid-dependent assets may increase execution risk.",
    });
  }

  if (tensions.some((t) => t.severity === "high")) {
    areas.push({
      category: "caution",
      description: "Strategic tensions detected between internal capabilities and execution patterns.",
    });
  }

  // Observation areas
  if (crossFormatCapability.overallStability === "volatile") {
    areas.push({
      category: "observation",
      description: "Format-specific performance variance requires continued monitoring.",
    });
  }

  if (marketContext.divergenceRisk === "medium" || marketContext.divergenceRisk === "high") {
    areas.push({
      category: "observation",
      description: "Divergence from market patterns may indicate differentiation or execution risk.",
    });
  }

  if (portfolio.momentOnly.length > 0) {
    areas.push({
      category: "observation",
      description: "Moment-aligned content patterns require ongoing trend monitoring.",
    });
  }

  return areas;
}

