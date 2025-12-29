import { YouTubeVideoAsset, YouTubeRetentionMetrics, YouTubeInsight } from "@/types/youtube";
import { mapNarrativeStructure, NarrativeStructure } from "../narrative-analysis/narrative-mapper";
import { analyzeRetention, RetentionAnalysis } from "../retention-analysis/retention-analyzer";
import { interpretDropOffs, DropOffAnalysis } from "../retention-analysis/drop-off-interpreter";
import { estimateLongTailPotential, LongTailAnalysis } from "../long-tail-analysis/long-tail-estimator";
import { InsightSentenceBuilder } from "@/lib/insight-language/insight-sentence-framework";

export function generateYouTubeInsights(
  video: YouTubeVideoAsset,
  metrics: YouTubeRetentionMetrics
): YouTubeInsight[] {
  const insights: YouTubeInsight[] = [];
  
  const narrativeStructure = mapNarrativeStructure(video);
  const retentionAnalysis = analyzeRetention(metrics, narrativeStructure);
  const dropOffAnalysis = interpretDropOffs(metrics, narrativeStructure);
  const longTailAnalysis = estimateLongTailPotential(metrics, retentionAnalysis, narrativeStructure);
  
  // Narrative insights
  if (narrativeStructure.pacingScore < 6) {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .metricObservation(
        "Pacing score",
        narrativeStructure.pacingScore,
        "narrative structure demonstrates pacing patterns"
      )
      .executionSensitivityFraming(
        "this video",
        "format_dependent",
        "segment length variations may influence retention patterns"
      )
      .build();

    insights.push({
      id: `youtube-insight-${video.id}-pacing`,
      assetId: video.id,
      type: "narrative",
      title: "Narrative Pacing Needs Optimization",
      description,
      confidence: "high",
    });
  } else if (narrativeStructure.pacingScore >= 8) {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .metricObservation(
        "Pacing score",
        narrativeStructure.pacingScore,
        "narrative structure demonstrates strong pacing alignment"
      )
      .attentionModeFraming(
        "this video",
        "sustained",
        "viewer retention and algorithmic discovery contexts"
      )
      .build();

    insights.push({
      id: `youtube-insight-${video.id}-pacing-good`,
      assetId: video.id,
      type: "narrative",
      title: "Strong Narrative Pacing",
      description,
      confidence: "high",
    });
  }
  
  // Retention insights by segment
  retentionAnalysis.retentionBySegment.forEach(insight => {
    if (insight.retentionImpact === "negative") {
      insights.push({
        id: `youtube-insight-${video.id}-retention-${insight.segmentType}`,
        assetId: video.id,
        type: "retention",
        title: `${insight.segmentType.charAt(0).toUpperCase() + insight.segmentType.slice(1)} Segment Retention Issue`,
        description: insight.description,
        confidence: "high",
        segmentType: insight.segmentType,
      });
    } else if (insight.retentionImpact === "positive" && insight.segmentType === "payoff") {
      insights.push({
        id: `youtube-insight-${video.id}-payoff-strong`,
        assetId: video.id,
        type: "retention",
        title: "Strong Payoff Sustains Long-Tail Watch Time",
        description: insight.description,
        confidence: "high",
        segmentType: insight.segmentType,
      });
    }
  });
  
  // Drop-off insights
  if (dropOffAnalysis.majorDropOffs.length > 0) {
    dropOffAnalysis.majorDropOffs.forEach((dropOff, idx) => {
      insights.push({
        id: `youtube-insight-${video.id}-dropoff-${idx}`,
        assetId: video.id,
        type: "drop_off",
        title: `Major Drop-Off at ${dropOff.second}s`,
        description: `${dropOff.interpretation} Drop-off rate: ${dropOff.dropOffRate.toFixed(1)}%.`,
        confidence: "high",
        segmentType: dropOff.segmentType,
      });
    });
  }
  
  // Long-tail insights
  if (longTailAnalysis.longTailPotential === "high") {
    insights.push({
      id: `youtube-insight-${video.id}-longtail`,
      assetId: video.id,
      type: "long_tail",
      title: "High Long-Tail Potential",
      description: `${longTailAnalysis.reasoning} Estimated long-tail views: ${longTailAnalysis.estimatedLongTailViews.toLocaleString()}.`,
      confidence: "medium",
    });
  } else if (longTailAnalysis.longTailPotential === "low") {
    insights.push({
      id: `youtube-insight-${video.id}-longtail-low`,
      assetId: video.id,
      type: "long_tail",
      title: "Limited Long-Tail Potential",
      description: longTailAnalysis.reasoning,
      confidence: "medium",
    });
  }
  
  // Overall retention trend
  if (retentionAnalysis.overallTrend === "improving") {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .temporalStabilityFraming(
        "this video",
        "stable",
        "Retention improves throughout the video, suggesting narrative pacing supports algorithmic discovery."
      )
      .build();

    insights.push({
      id: `youtube-insight-${video.id}-trend-improving`,
      assetId: video.id,
      type: "retention",
      title: "Improving Retention Trend",
      description,
      confidence: "high",
    });
  } else if (retentionAnalysis.overallTrend === "declining") {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .temporalStabilityFraming(
        "this video",
        "declining",
        "Retention declines throughout the video, which may indicate narrative structure or engagement patterns in later segments."
      )
      .build();

    insights.push({
      id: `youtube-insight-${video.id}-trend-declining`,
      assetId: video.id,
      type: "retention",
      title: "Declining Retention Trend",
      description,
      confidence: "high",
    });
  }
  
  return insights;
}

