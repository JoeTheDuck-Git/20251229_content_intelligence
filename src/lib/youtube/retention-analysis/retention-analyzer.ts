import { YouTubeRetentionMetrics, YouTubeNarrativeSegment, RetentionInsight } from "@/types/youtube";
import { NarrativeStructure } from "../narrative-analysis/narrative-mapper";

export interface RetentionAnalysis {
  assetId: string;
  averageRetention: number;
  retentionBySegment: RetentionInsight[];
  overallTrend: "improving" | "stable" | "declining";
}

export function analyzeRetention(
  metrics: YouTubeRetentionMetrics,
  narrativeStructure: NarrativeStructure
): RetentionAnalysis {
  const retentionData = metrics.retentionData;
  
  // Calculate average retention
  const averageRetention = retentionData.reduce((sum, point) => sum + point.retentionRate, 0) / retentionData.length;
  
  // Analyze retention by segment
  const retentionBySegment: RetentionInsight[] = [];
  
  narrativeStructure.segments.forEach(segment => {
    // Find retention data points within this segment
    const segmentData = retentionData.filter(
      point => point.second >= segment.startSecond && point.second <= segment.endSecond
    );
    
    if (segmentData.length === 0) return;
    
    const segmentAvgRetention = segmentData.reduce((sum, point) => sum + point.retentionRate, 0) / segmentData.length;
    
    // Calculate drop-off rate
    const startRetention = segmentData[0].retentionRate;
    const endRetention = segmentData[segmentData.length - 1].retentionRate;
    const dropOffRate = startRetention - endRetention;
    
    // Determine impact
    let retentionImpact: "positive" | "neutral" | "negative" = "neutral";
    if (dropOffRate > 10) {
      retentionImpact = "negative";
    } else if (dropOffRate < -2) {
      retentionImpact = "positive";
    }
    
    // Generate description
    let description = "";
    if (segment.segmentType === "hook") {
      if (dropOffRate > 5) {
        description = "Hook fails to maintain initial attention";
      } else if (dropOffRate < 2) {
        description = "Strong hook maintains viewer attention";
      } else {
        description = "Hook performs adequately";
      }
    } else if (segment.segmentType === "setup") {
      if (dropOffRate > 15) {
        description = "Extended setup causes significant viewer drop-off";
      } else if (dropOffRate < 5) {
        description = "Setup maintains engagement effectively";
      } else {
        description = "Setup shows moderate retention";
      }
    } else if (segment.segmentType === "core") {
      if (dropOffRate < 5) {
        description = "Core content sustains strong retention";
      } else if (dropOffRate > 15) {
        description = "Core content struggles to maintain viewers";
      } else {
        description = "Core content shows stable retention";
      }
    } else if (segment.segmentType === "payoff") {
      if (dropOffRate < 3) {
        description = "Strong payoff sustains long-tail watch time";
      } else {
        description = "Payoff shows typical end-of-video drop-off";
      }
    }
    
    retentionBySegment.push({
      segmentType: segment.segmentType,
      retentionImpact,
      averageRetention: segmentAvgRetention,
      dropOffRate,
      description,
    });
  });
  
  // Determine overall trend
  const earlyRetention = retentionData.slice(0, Math.floor(retentionData.length / 3));
  const lateRetention = retentionData.slice(-Math.floor(retentionData.length / 3));
  const earlyAvg = earlyRetention.reduce((sum, p) => sum + p.retentionRate, 0) / earlyRetention.length;
  const lateAvg = lateRetention.reduce((sum, p) => sum + p.retentionRate, 0) / lateRetention.length;
  
  let overallTrend: "improving" | "stable" | "declining" = "stable";
  if (lateAvg > earlyAvg + 2) {
    overallTrend = "improving";
  } else if (lateAvg < earlyAvg - 2) {
    overallTrend = "declining";
  }
  
  return {
    assetId: metrics.assetId,
    averageRetention,
    retentionBySegment,
    overallTrend,
  };
}

