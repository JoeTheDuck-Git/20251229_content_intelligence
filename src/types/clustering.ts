export type Pacing = "slow" | "medium" | "fast";
export type VisualDensity = "low" | "medium" | "high";
export type DurationBucket = "short" | "mid" | "long";
export type FatigueStatus = "healthy" | "early_warning" | "fatigued";
export type FatigueRiskLevel = "low" | "medium" | "high";
export type ScaleReliability = "unstable" | "moderate" | "reliable";

export interface CreativeSignature {
  assetId: string;
  hookType: string;
  pacing: Pacing;
  voiceType: string;
  visualDensity: VisualDensity;
  durationBucket: DurationBucket;
  fatigueStatus: FatigueStatus;
}

export interface CreativeCluster {
  clusterId: string;
  label: string;
  definingFeatures: string[];
  assetIds: string[];
  fatigueRiskLevel: FatigueRiskLevel;
  scaleReliability: ScaleReliability;
  explanation: string;
  usageGuidance: string[];
}

export interface ClusterAnalysis {
  cluster: CreativeCluster;
  totalCreatives: number;
  fatigueDistribution: {
    healthy: number;
    early_warning: number;
    fatigued: number;
  };
  averageMetrics: {
    avgCTR: number;
    avgROAS: number;
    avgFrequency: number;
  };
  clusterInsights: string[];
}

