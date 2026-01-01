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

// Market Context Types (for Dashboard)
// These types represent interpreted market signals, not raw trend observations
export type PresenceChange = "increasing" | "stable" | "decreasing" | "emerging";

export interface TrendSignal {
  id: string;
  topic: string;
  category: "hook" | "narrative" | "visual" | "tone" | "topic";
  presence: {
    recent: PresenceChange;
    midTerm: PresenceChange;
    baseline: PresenceChange;
  };
  description: string;
  confidence: "high" | "medium" | "low";
  // Internal confidence dimensions (for tooltip explanation)
  confidenceDimensions?: {
    presenceConsistency: "strong" | "consistent" | "weak";
    temporalStability: "strong" | "consistent" | "weak";
    contextDiversity: "strong" | "consistent" | "weak";
    signalCoherence: "strong" | "consistent" | "weak";
  };
}

export interface TrendInterpretation {
  id: string;
  title: string;
  narrative: string;
  observedPatterns: string[];
  confidence: "high" | "medium" | "low";
}

export interface TrendStrategicInterpretation {
  id: string;
  signalId: string;
  signalTopic: string;
  signalCategory: TrendSignal["category"];
  observation: {
    description: string;
    confidence: "high" | "medium" | "low";
    observedContexts: {
      formats?: ("text" | "image" | "video")[];
      channels?: ("Meta" | "TikTok" | "YouTube")[];
      timePeriods: ("recent" | "midTerm" | "baseline")[];
    };
  };
  interpretation: {
    exploratoryStatement: string;
    patternDescription: string;
  };
  strategicImplication: {
    whyItMatters: string;
    contextualRelevance: string;
  };
  applicabilityScope: {
    relevantFormats: ("text" | "image" | "video")[];
    relevantChannels: ("Meta" | "TikTok" | "YouTube")[];
    funnelStages?: ("awareness" | "consideration" | "conversion")[];
    notes?: string;
  };
  cautionBoundary: {
    nonCausality: string;
    nonGuarantees: string;
    interpretationLimits: string;
  };
}

