// Legacy types for backward compatibility
export type Platform = "YouTube" | "Meta" | "TikTok";

export type ScalePotential = "low" | "medium" | "high";

export interface CreativeFeatures {
  hookType: string;
  pacing: string;
  voiceType: string;
}

export interface ContentAsset {
  id: string;
  platform: Platform;
  contentType: "video";
  duration: number;
  creativeFeatures: CreativeFeatures;
  publishDate: string;
  views?: number;
  ctr?: number;
  roas?: number;
}

export interface AdsMetrics {
  assetId: string;
  spend: number;
  impressions: number;
  ctr: number;
  conversions: number;
  roas: number;
  date: string;
}

export interface Measurement {
  assetId: string;
  hookScore: number;
  engagementScore: number;
  scalePotential: ScalePotential;
  creativeFatigue: boolean;
}

export interface Insight {
  id: string;
  type: "positive" | "warning" | "recommendation";
  title: string;
  description: string;
  assetId?: string;
  priority?: "high" | "medium" | "low";
}

export interface Recommendation {
  videoLength: number;
  hookType: string;
  pacing: string;
  reasoning: string;
}

// Export new types for Ads Intelligence System
export * from "./ads";
export * from "./creative";
export * from "./insights";
export * from "./organic";
export * from "./trend";
export * from "./youtube";
export * from "./competitor";

