export type OrganicPlatform = "YouTube" | "Meta" | "TikTok";
export type ContentFormat = "image" | "video";
export type VisualFocus = "product" | "person" | "scene" | "text";
export type Pacing = "slow" | "medium" | "fast";
export type EmotionalTone = "informative" | "entertaining" | "inspiring";
export type MomentumType = "organic_spike" | "steady_growth" | "viral_candidate" | "decaying";
export type PlatformFit = "low" | "medium" | "high";

export interface CreativeSignals {
  hookStyle: string;
  visualFocus: VisualFocus;
  pacing?: Pacing;
  emotionalTone: EmotionalTone;
}

export interface OrganicContentAsset {
  id: string;
  platform: OrganicPlatform;
  format: ContentFormat;
  duration?: number;
  creativeSignals: CreativeSignals;
  publishDate: string;
  title?: string;
  thumbnailUrl?: string;
}

export interface OrganicPerformanceMetrics {
  assetId: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  watchTime?: number;
  engagementVelocity: number;
  date: string;
}

export interface OrganicMomentumState {
  assetId: string;
  momentumType: MomentumType;
  platformFit: PlatformFit;
  velocityScore: number;
  resonanceScore: number;
}

export interface OrganicInsight {
  id: string;
  assetId: string;
  type: "momentum" | "platform_fit" | "creative_signal" | "timing";
  title: string;
  description: string;
  confidence: "high" | "medium" | "low";
}

export interface PlatformRecommendation {
  platform: OrganicPlatform;
  reasoning: string;
  creativeGuidance: string[];
}

