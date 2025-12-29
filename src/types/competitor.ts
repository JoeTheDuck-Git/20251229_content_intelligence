import type { ContentFormat, VisualFocus } from "./organic";

export type CompetitorPlatform = "Instagram" | "TikTok" | "YouTube";
export type { ContentFormat, VisualFocus };
export type TrendDirection = "emerging" | "stable" | "declining";
export type SignalType = "keyword" | "hook" | "visual" | "narrative";

export interface CompetitorProfile {
  id: string;
  brandName: string;
  platforms: CompetitorPlatform[];
  category: string;
}

export interface CompetitorCreativeSignals {
  visualFocus: VisualFocus;
  hookStyle: string;
  narrativeAngle: string;
  keywords: string[];
}

export interface CompetitorContentAsset {
  assetId: string;
  competitorId: string;
  platform: CompetitorPlatform;
  format: ContentFormat;
  publishDate: string;
  creativeSignals: CompetitorCreativeSignals;
  caption?: string;
  thumbnailUrl?: string;
}

export interface CompetitorSignalTrend {
  competitorId: string;
  signalType: SignalType;
  signalName: string;
  trendDirection: TrendDirection;
  frequency: number;
  changePercentage?: number;
}

export interface EmphasisPattern {
  signalType: SignalType;
  signalName: string;
  frequency: number;
  percentage: number;
  trendDirection: TrendDirection;
}

export interface CompetitorInsight {
  id: string;
  competitorId: string;
  type: "emphasis_shift" | "narrative_change" | "keyword_emergence" | "visual_evolution";
  title: string;
  description: string;
  observedDate: string;
  confidence: "high" | "medium" | "low";
}

export interface CompetitorSignal {
  tagType: "hook" | "narrative" | "visual" | "cta" | "tone";
  tagName: string;
  marketPresence: "underrepresented" | "aligned" | "overrepresented";
  confidence: "low" | "medium" | "high";
}

export interface MarketContextAnalysis {
  overallAlignment: "aligned" | "crowded" | "divergent";
  overrepresentedTags: CompetitorSignal[];
  underrepresentedTags: CompetitorSignal[];
  saturationRisk: "low" | "medium" | "high";
  divergenceRisk: "low" | "medium" | "high";
}

