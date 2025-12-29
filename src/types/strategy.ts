export type Platform = "Meta" | "TikTok" | "YouTube";
export type FatigueStatus = "healthy" | "warning" | "fatigued";
export type PatternType = "cross_platform_stable" | "platform_sensitive" | "platform_specific";
export type ScaleReliability = "unstable" | "moderate" | "reliable";
export type RecommendedAction = "scale" | "maintain" | "refresh_creative" | "pause";
export type ConfidenceLevel = "low" | "medium" | "high";

export interface FatigueSummary {
  Meta?: FatigueStatus;
  TikTok?: FatigueStatus;
  YouTube?: FatigueStatus;
}

export interface StrategyContext {
  clusterId: string;
  patternType: PatternType;
  fatigueSummary: FatigueSummary;
  scaleReliability: ScaleReliability;
  platformMetrics: {
    [key in Platform]?: {
      avgCTR: number;
      avgROAS: number;
      avgFrequency: number;
    };
  };
}

export interface StrategyRecommendation {
  platform: Platform;
  recommendedAction: RecommendedAction;
  rationale: string;
  creativeGuidance: string[];
  confidenceLevel: ConfidenceLevel;
  traceableIntelligence: string[];
}

export interface StrategyOutput {
  clusterId: string;
  clusterLabel: string;
  context: StrategyContext;
  recommendations: StrategyRecommendation[];
  overallConfidence: ConfidenceLevel;
  strategyExplanation: string;
  dataCompleteness: {
    fatigueData: boolean;
    clusterData: boolean;
    multiChannelData: boolean;
  };
}

export interface ActionPlaybook {
  id: string;
  title: string;
  description: string;
  applicableScenarios: string[];
  steps: string[];
  expectedOutcome: string;
}

