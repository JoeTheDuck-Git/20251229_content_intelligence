export type Platform = "Meta" | "YouTube" | "TikTok";

export type Pacing = "slow" | "medium" | "fast";
export type VoiceType = "voiceover" | "talking-head" | "text-only";
export type VisualDensity = "low" | "medium" | "high";

export type FatigueStatus = "healthy" | "warning" | "fatigued";
export type ScalePotential = "low" | "medium" | "high";

export interface CreativeFeatures {
  hookType: string;
  pacing: Pacing;
  voiceType: VoiceType;
  visualDensity: VisualDensity;
}

export interface AdsCreativeAsset {
  id: string;
  platform: Platform;
  format: "video";
  duration: number;
  creativeFeatures: CreativeFeatures;
  createdAt: string;
}

export interface AdsPerformanceMetrics {
  assetId: string;
  spend: number;
  impressions: number;
  ctr: number;
  cpa: number;
  roas: number;
  frequency: number;
  date: string;
}

export interface CreativeIntelligenceResult {
  assetId: string;
  fatigueStatus: FatigueStatus;
  scalePotential: ScalePotential;
  keyDrivers: string[];
  riskSignals: string[];
}

