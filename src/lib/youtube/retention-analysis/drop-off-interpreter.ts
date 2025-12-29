import { YouTubeRetentionMetrics, YouTubeNarrativeSegment, DropOffAnalysis } from "@/types/youtube";
import { NarrativeStructure } from "../narrative-analysis/narrative-mapper";

export function interpretDropOffs(
  metrics: YouTubeRetentionMetrics,
  narrativeStructure: NarrativeStructure
): DropOffAnalysis {
  const retentionData = metrics.retentionData;
  const majorDropOffs: DropOffAnalysis["majorDropOffs"] = [];
  
  // Find significant drop-offs (rate change > 5%)
  for (let i = 1; i < retentionData.length; i++) {
    const prev = retentionData[i - 1];
    const curr = retentionData[i];
    const dropOffRate = prev.retentionRate - curr.retentionRate;
    
    if (dropOffRate > 5) {
      // Find which segment this drop-off occurs in
      const segment = narrativeStructure.segments.find(
        seg => curr.second >= seg.startSecond && curr.second <= seg.endSecond
      );
      
      if (segment) {
        let interpretation = "";
        if (segment.segmentType === "hook") {
          interpretation = "Viewers drop during hook - opening may not be compelling enough";
        } else if (segment.segmentType === "setup") {
          interpretation = "Viewers drop during extended setup sections - context may be too lengthy";
        } else if (segment.segmentType === "core") {
          interpretation = "Viewers drop during core content - pacing or value may need adjustment";
        } else if (segment.segmentType === "payoff") {
          interpretation = "Viewers drop during payoff - conclusion may not be satisfying";
        }
        
        majorDropOffs.push({
          second: curr.second,
          dropOffRate,
          segmentType: segment.segmentType,
          interpretation,
        });
      }
    }
  }
  
  // Generate retention insights
  const retentionInsights: DropOffAnalysis["retentionInsights"] = [];
  
  narrativeStructure.segments.forEach(segment => {
    const segmentData = retentionData.filter(
      point => point.second >= segment.startSecond && point.second <= segment.endSecond
    );
    
    if (segmentData.length === 0) return;
    
    const startRetention = segmentData[0].retentionRate;
    const endRetention = segmentData[segmentData.length - 1].retentionRate;
    const avgRetention = segmentData.reduce((sum, p) => sum + p.retentionRate, 0) / segmentData.length;
    const dropOffRate = startRetention - endRetention;
    
    let retentionImpact: "positive" | "neutral" | "negative" = "neutral";
    if (dropOffRate > 10) {
      retentionImpact = "negative";
    } else if (dropOffRate < -2) {
      retentionImpact = "positive";
    }
    
    let description = "";
    if (segment.segmentType === "setup" && dropOffRate > 15) {
      description = "Extended setup causes significant viewer drop-off";
    } else if (segment.segmentType === "core" && dropOffRate < 5) {
      description = "Core content maintains strong retention";
    } else if (segment.segmentType === "payoff" && dropOffRate < 3) {
      description = "Strong payoff sustains long-tail watch time";
    } else {
      description = `${segment.segmentType} segment shows ${retentionImpact} retention impact`;
    }
    
    retentionInsights.push({
      segmentType: segment.segmentType,
      retentionImpact,
      averageRetention: avgRetention,
      dropOffRate,
      description,
    });
  });
  
  return {
    assetId: metrics.assetId,
    majorDropOffs,
    retentionInsights,
  };
}

