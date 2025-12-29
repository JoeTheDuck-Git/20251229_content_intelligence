export type MomentIntensity = "low" | "medium" | "high";
export type AlignmentStrength = "none" | "weak" | "strong";
export type AmplificationImpact = "low" | "medium" | "high";

export interface MomentContext {
  id: string;
  topic: string;
  description?: string;
  startDate: string;
  endDate: string;
  intensityLevel: MomentIntensity;
  category?: "trending" | "seasonal" | "event" | "cultural" | "platform-native";
  relatedKeywords?: string[];
}

export interface TopicTag {
  assetId: string;
  primaryTopic: string;
  secondaryTopics: string[];
  extractedKeywords: string[];
  confidence: "high" | "medium" | "low";
}

export interface MomentAlignmentResult {
  assetId: string;
  momentId: string;
  alignmentStrength: AlignmentStrength;
  amplificationImpact: AmplificationImpact;
  timingScore: number; // 0-10
  topicRelevanceScore: number; // 0-10
  estimatedUplift?: number; // percentage
}

export interface TrendInsight {
  id: string;
  assetId: string;
  type: "moment_alignment" | "timing_impact" | "contextual_amplification" | "independent_performance";
  title: string;
  description: string;
  confidence: "high" | "medium" | "low";
  momentId?: string;
}

