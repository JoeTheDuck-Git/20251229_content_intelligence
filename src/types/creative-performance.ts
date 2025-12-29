// Creative Performance Intelligence Types

export type FormatType = "text" | "image" | "video";

export type StrengthLevel = "strong" | "mixed" | "weak";
export type StabilityLevel = "consistent" | "volatile";
export type EfficiencyLevel = "high" | "medium" | "low";
export type ConfidenceLevel = "high" | "medium" | "low";

// Creative Tag Types
export interface CreativeTag {
  id: string;
  name: string;
  category: "hook" | "narrative" | "visual" | "product" | "cta" | "tone";
}

// Cross-Format Performance
export interface FormatStrength {
  format: FormatType;
  strength: StrengthLevel;
  stability: StabilityLevel;
  confidence: ConfidenceLevel;
}

export interface CrossFormatTagPerformance {
  tagId: string;
  tagName: string;
  formatStrengths: FormatStrength[];
  crossFormatConsistency: StabilityLevel;
  overallConfidence: ConfidenceLevel;
}

export interface CrossFormatCapability {
  textStrength: StrengthLevel;
  imageStrength: StrengthLevel;
  videoStrength: StrengthLevel;
  overallStability: StabilityLevel;
  formatSpecificPatterns: {
    video: string[];
    image: string[];
    text: string[];
  };
}

// Paid Creative Performance
export interface PaidTagEfficiency {
  tagId: string;
  tagName: string;
  efficiencyStrength: EfficiencyLevel;
  stabilityUnderSpend: StabilityLevel;
  fatigueSensitivity: "low" | "medium" | "high";
  scaleReliability: "reliable" | "moderate" | "unreliable";
  confidence: ConfidenceLevel;
}

export interface PaidCreativeHealth {
  overallHealth: "healthy" | "moderate" | "at-risk";
  efficiencyStability: StabilityLevel;
  concentrationRisk: "low" | "medium" | "high";
}

// Organic Creative Performance
export interface OrganicTagResonance {
  tagId: string;
  tagName: string;
  engagementStrength: StrengthLevel;
  momentumConsistency: StabilityLevel;
  longTailSignal: "strong" | "moderate" | "weak";
  momentDriven: boolean;
  evergreenPotential: boolean;
  confidence: ConfidenceLevel;
}

export interface OrganicResonanceHealth {
  overallStrength: StrengthLevel;
  momentumStability: StabilityLevel;
  longTailPotential: "strong" | "moderate" | "weak";
}

// Competitor Signals (Market Context)
export type MarketPresence = "underrepresented" | "aligned" | "overrepresented";
export type MarketSaturation = "lightly used" | "common" | "saturated";
export type MarketUsage = "rare" | "typical" | "heavily used";

export interface CompetitorSignal {
  tagType: "hook" | "narrative" | "visual" | "cta" | "tone";
  tagName: string;
  marketPresence: MarketPresence;
  confidence: ConfidenceLevel;
  contextualExplanation: string;
}

export interface PaidMarketSignal {
  tagId: string;
  tagName: string;
  marketSaturation: MarketSaturation;
  confidence: ConfidenceLevel;
  explanation: string;
}

export interface OrganicMarketSignal {
  tagId: string;
  tagName: string;
  marketUsage: MarketUsage;
  confidence: ConfidenceLevel;
  explanation: string;
}

// Time Perspective Types
export type TimePerspective = "Recent" | "MidTerm" | "Baseline";

export type TagStabilityLevel = "strong" | "mixed" | "weak";

export interface TagStability {
  recent: TagStabilityLevel;
  midTerm: TagStabilityLevel;
  baseline: TagStabilityLevel;
}

export interface TagEvolutionInsight {
  stability: TagStability;
  classification: "Consistent Capability" | "Emerging Pattern" | "Decaying Element" | "Volatile Signal";
  interpretation: string;
  marketContextNote?: string;
}

// Creative Insight Types
export interface CreativeInsight {
  tag: string;
  context: "paid" | "organic" | "cross-format";
  insightText: string; // 使用 InsightSentenceBuilder 生成的合規句子
}

