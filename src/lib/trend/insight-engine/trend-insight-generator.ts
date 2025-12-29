import { OrganicContentAsset, OrganicPerformanceMetrics } from "@/types/organic";
import { MomentContext, MomentAlignmentResult, TrendInsight } from "@/types/trend";
import { findAlignedMoments } from "../moment-analysis/alignment-detector";
import { estimateAmplificationImpact } from "../moment-analysis/amplification-estimator";
import { analyzeVelocity } from "@/lib/organic/momentum-intelligence/velocity-analyzer";
import { InsightSentenceBuilder } from "@/lib/insight-language/insight-sentence-framework";

export function generateTrendInsights(
  asset: OrganicContentAsset,
  metrics: OrganicPerformanceMetrics[],
  moments: MomentContext[]
): TrendInsight[] {
  const insights: TrendInsight[] = [];
  const alignments = findAlignedMoments(asset, moments);
  const velocityAnalysis = analyzeVelocity(metrics);
  const latest = metrics[metrics.length - 1];
  
  if (alignments.length === 0) {
    // No moment alignment - content performed independently
    const builder = new InsightSentenceBuilder();
    const description = builder
      .momentumObservation(
        velocityAnalysis.averageVelocity,
        "strong engagement",
        "creative quality and platform-native fit contexts"
      )
      .temporalStabilityFraming(
        "this content",
        "stable",
        "Performance appears driven by creative quality and platform-native fit rather than timing."
      )
      .build();

    insights.push({
      id: `trend-insight-${asset.id}-independent`,
      assetId: asset.id,
      type: "independent_performance",
      title: "Strong Performance Despite Low Moment Alignment",
      description,
      confidence: "medium",
    });
    return insights;
  }
  
  // Process strongest alignment
  const strongestAlignment = alignments[0];
  const moment = moments.find(m => m.id === strongestAlignment.momentId);
  
  if (!moment) return insights;
  
  const amplification = estimateAmplificationImpact(metrics, strongestAlignment, moment);
  
  // Moment alignment insights
  if (strongestAlignment.alignmentStrength === "strong") {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .metricObservation(
        "Moment alignment",
        strongestAlignment.timingScore,
        `this content aligned strongly with "${moment.topic}" (${moment.intensityLevel} intensity)`
      )
      .metricObservation(
        "Topic relevance",
        strongestAlignment.topicRelevanceScore,
        "alignment strength demonstrates contextual fit"
      )
      .build();

    insights.push({
      id: `trend-insight-${asset.id}-alignment`,
      assetId: asset.id,
      type: "moment_alignment",
      title: "Strong Moment Alignment Detected",
      description,
      confidence: "high",
      momentId: moment.id,
    });
  } else {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .platformAlignmentObservation(
        "this content",
        moment.topic,
        "timing or topic relevance",
        "alignment strength may not be optimal for maximum amplification"
      )
      .build();

    insights.push({
      id: `trend-insight-${asset.id}-weak-alignment`,
      assetId: asset.id,
      type: "moment_alignment",
      title: "Weak Moment Alignment",
      description,
      confidence: "medium",
      momentId: moment.id,
    });
  }
  
  // Timing impact insights
  if (strongestAlignment.timingScore >= 7) {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .metricObservation(
        "Timing score",
        strongestAlignment.timingScore,
        "content was published at the optimal time within the moment window"
      )
      .temporalStabilityFraming(
        "this content",
        "emerging",
        "Early momentum suggests timing played a key role in amplification."
      )
      .build();

    insights.push({
      id: `trend-insight-${asset.id}-timing`,
      assetId: asset.id,
      type: "timing_impact",
      title: "Optimal Timing Drove Performance",
      description,
      confidence: "high",
      momentId: moment.id,
    });
  } else if (strongestAlignment.timingScore < 4 && strongestAlignment.alignmentStrength === "strong") {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .metricObservation(
        "Timing score",
        strongestAlignment.timingScore,
        `content aligned with "${moment.topic}" but timing was not optimal`
      )
      .temporalStabilityFraming(
        "this content",
        "stable",
        "Strong performance suggests content quality overcame timing limitations."
      )
      .build();

    insights.push({
      id: `trend-insight-${asset.id}-late-timing`,
      assetId: asset.id,
      type: "timing_impact",
      title: "Strong Content Despite Suboptimal Timing",
      description,
      confidence: "medium",
      momentId: moment.id,
    });
  }
  
  // Amplification impact insights
  if (amplification.estimatedMomentContribution > 0) {
    const contributionPercent = (amplification.estimatedMomentContribution / amplification.actualPerformance) * 100;
    
    if (contributionPercent > 30) {
      const builder = new InsightSentenceBuilder();
      const description = builder
        .metricObservation(
          "Performance uplift",
          contributionPercent,
          "moment alignment appears to drive significant amplification"
        )
        .distributionContextFraming(
          "this content",
          "organic",
          "timing and context significantly amplified organic reach"
        )
        .build();

      insights.push({
        id: `trend-insight-${asset.id}-amplification`,
        assetId: asset.id,
        type: "contextual_amplification",
        title: "High Contextual Amplification Impact",
        description,
        confidence: amplification.confidence,
        momentId: moment.id,
      });
    } else if (contributionPercent > 10) {
      const builder = new InsightSentenceBuilder();
      const description = builder
        .metricObservation(
          "Performance attribution",
          contributionPercent,
          "moment alignment may contribute to observed patterns"
        )
        .temporalStabilityFraming(
          "this content",
          "stable",
          "Content quality and platform fit remain primary drivers."
        )
        .build();

      insights.push({
        id: `trend-insight-${asset.id}-moderate-amplification`,
        assetId: asset.id,
        type: "contextual_amplification",
        title: "Moderate Contextual Amplification",
        description,
        confidence: amplification.confidence,
        momentId: moment.id,
      });
    }
  }
  
  // Performance despite alignment
  if (strongestAlignment.alignmentStrength === "strong" && velocityAnalysis.averageVelocity < 5) {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .momentumObservation(
        velocityAnalysis.averageVelocity,
        "low engagement velocity",
        `content aligned strongly with "${moment.topic}" but performance remains limited`
      )
      .executionSensitivityFraming(
        "this content",
        "context_dependent",
        "creative execution or platform fit factors"
      )
      .build();

    insights.push({
      id: `trend-insight-${asset.id}-underperformance`,
      assetId: asset.id,
      type: "moment_alignment",
      title: "Underperformance Despite Strong Alignment",
      description,
      confidence: "high",
      momentId: moment.id,
    });
  }
  
  return insights;
}

