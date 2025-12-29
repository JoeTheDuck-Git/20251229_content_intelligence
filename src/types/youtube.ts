export type NarrativeSegmentType = "hook" | "setup" | "core" | "payoff";
export type RetentionImpact = "positive" | "neutral" | "negative";
export type LongTailPotential = "low" | "medium" | "high";

export interface YouTubeNarrativeSegment {
  segmentType: NarrativeSegmentType;
  startSecond: number;
  endSecond: number;
  description?: string;
}

export interface YouTubeVideoAsset {
  id: string;
  title: string;
  duration: number; // in seconds
  publishDate: string;
  narrativeSegments: YouTubeNarrativeSegment[];
  thumbnailUrl?: string;
}

export interface RetentionDataPoint {
  second: number;
  retentionRate: number; // percentage of viewers still watching
}

export interface YouTubeRetentionMetrics {
  assetId: string;
  totalWatchTime: number; // in seconds
  averageWatchTime: number; // in seconds
  retentionData: RetentionDataPoint[];
  date: string;
}

export interface RetentionInsight {
  segmentType: NarrativeSegmentType;
  retentionImpact: RetentionImpact;
  averageRetention: number;
  dropOffRate?: number;
  description: string;
}

export interface DropOffAnalysis {
  assetId: string;
  majorDropOffs: Array<{
    second: number;
    dropOffRate: number;
    segmentType: NarrativeSegmentType;
    interpretation: string;
  }>;
  retentionInsights: RetentionInsight[];
}

export interface LongTailAnalysis {
  assetId: string;
  longTailPotential: LongTailPotential;
  estimatedLongTailViews: number;
  reasoning: string;
  watchTimeTrend: "increasing" | "stable" | "decreasing";
}

export interface YouTubeInsight {
  id: string;
  assetId: string;
  type: "retention" | "narrative" | "drop_off" | "long_tail";
  title: string;
  description: string;
  confidence: "high" | "medium" | "low";
  segmentType?: NarrativeSegmentType;
}

