import {
  OrganicContentAsset,
  OrganicPerformanceMetrics,
  OrganicMomentumState,
  OrganicInsight,
  PlatformRecommendation,
} from "@/types/organic";
import { extractCreativeSignals } from "../creative-signals/signal-extractor";
import { analyzeVelocity } from "../momentum-intelligence/velocity-analyzer";
import {
  classifyMomentum,
  generateMomentumState,
} from "../momentum-intelligence/lifecycle-classifier";
import { InsightSentenceBuilder } from "@/lib/insight-language/insight-sentence-framework";

export function generateOrganicInsights(
  asset: OrganicContentAsset,
  metrics: OrganicPerformanceMetrics[],
  momentumState: OrganicMomentumState
): OrganicInsight[] {
  const insights: OrganicInsight[] = [];
  const signals = extractCreativeSignals(asset);
  const velocityAnalysis = analyzeVelocity(metrics);
  const latest = metrics[metrics.length - 1];

  // Momentum insights
  if (momentumState.momentumType === "viral_candidate") {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .momentumObservation(
        velocityAnalysis.averageVelocity,
        "accelerating engagement",
        "platform-native fit driving organic amplification"
      )
      .attentionModeFraming(
        "this content",
        "rapid_capture",
        "organic distribution environments"
      )
      .build();

    insights.push({
      id: `insight-${asset.id}-viral`,
      assetId: asset.id,
      type: "momentum",
      title: "Viral Momentum Detected",
      description,
      confidence: "high",
    });
  } else if (momentumState.momentumType === "organic_spike") {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .momentumObservation(
        velocityAnalysis.peakVelocity,
        "strong initial spike",
        "timing or trend alignment contexts"
      )
      .temporalStabilityFraming(
        "this content",
        "declining",
        "Momentum is declining, likely driven by timing or trend alignment rather than sustained content depth."
      )
      .build();

    insights.push({
      id: `insight-${asset.id}-spike`,
      assetId: asset.id,
      type: "momentum",
      title: "One-Time Organic Spike",
      description,
      confidence: "medium",
    });
  } else if (momentumState.momentumType === "steady_growth") {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .momentumObservation(
        velocityAnalysis.averageVelocity,
        "consistent organic growth",
        "stable engagement patterns"
      )
      .temporalStabilityFraming(
        "this content",
        "stable",
        "The growth pattern suggests sustainable audience resonance."
      )
      .build();

    insights.push({
      id: `insight-${asset.id}-steady`,
      assetId: asset.id,
      type: "momentum",
      title: "Steady Organic Growth",
      description,
      confidence: "high",
    });
  } else {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .momentumObservation(
        velocityAnalysis.averageVelocity,
        "declining engagement",
        "platform-native behavior or audience expectations"
      )
      .temporalStabilityFraming(
        "this content",
        "declining",
        "This suggests the content may not align well with platform-native behavior or audience expectations."
      )
      .build();

    insights.push({
      id: `insight-${asset.id}-decay`,
      assetId: asset.id,
      type: "momentum",
      title: "Momentum Decaying",
      description,
      confidence: "medium",
    });
  }

  // Platform fit insights
  if (momentumState.platformFit === "high") {
    const builder = new InsightSentenceBuilder();
    const signalsDesc = `${signals.pacingCategory} pacing, ${signals.visualDominance}`;
    const description = builder
      .platformAlignmentObservation(
        "this content",
        asset.platform,
        signalsDesc,
        "audience expectations align with creative signals"
      )
      .distributionContextFraming(
        "this content",
        "organic",
        "this alignment is likely driving organic amplification"
      )
      .build();

    insights.push({
      id: `insight-${asset.id}-fit-high`,
      assetId: asset.id,
      type: "platform_fit",
      title: "Strong Platform-Native Fit",
      description,
      confidence: "high",
    });
  } else if (momentumState.platformFit === "low") {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .platformAlignmentObservation(
        "this content",
        asset.platform,
        `${signals.pacingCategory} pacing, ${signals.visualDominance}`,
        "native behavior patterns differ from creative signals"
      )
      .build();

    insights.push({
      id: `insight-${asset.id}-fit-low`,
      assetId: asset.id,
      type: "platform_fit",
      title: "Low Platform Fit",
      description,
      confidence: "medium",
    });
  }

  // Creative signal insights
  if (signals.pacingCategory === "fast" && asset.platform === "TikTok") {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .attentionModeFraming(
        "this content",
        "rapid_capture",
        "interruptive contexts"
      )
      .platformAlignmentObservation(
        "this content",
        "TikTok",
        `fast pacing combined with ${signals.visualDominance} focus`,
        "early engagement patterns align with platform-native behavior"
      )
      .build();

    insights.push({
      id: `insight-${asset.id}-signal-pacing`,
      assetId: asset.id,
      type: "creative_signal",
      title: "Fast Pacing Drives TikTok Engagement",
      description,
      confidence: "high",
    });
  }

  if (signals.hookCategory === "narrative" && asset.platform === "YouTube") {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .cognitiveLoadFraming(
        "this content",
        "high",
        "environments that allow deeper engagement"
      )
      .platformAlignmentObservation(
        "this content",
        "YouTube",
        `story-driven approach with ${signals.pacingCategory} pacing`,
        "audience preference for deeper content aligns with creative signals"
      )
      .build();

    insights.push({
      id: `insight-${asset.id}-signal-narrative`,
      assetId: asset.id,
      type: "creative_signal",
      title: "Narrative Hook Resonates on YouTube",
      description,
      confidence: "high",
    });
  }

  // Timing insights (if velocity spike is early)
  if (metrics.length >= 2) {
    const earlyVelocity = metrics[0].engagementVelocity;
    const peakVelocity = velocityAnalysis.peakVelocity;
    if (peakVelocity > earlyVelocity * 1.5 && metrics.length <= 3) {
      const builder = new InsightSentenceBuilder();
      const description = builder
        .momentumObservation(
          earlyVelocity,
          "strong early velocity",
          "trending moment or audience need alignment"
        )
        .temporalStabilityFraming(
          "this content",
          "emerging",
          "The rapid initial growth suggests timing played a key role in observed patterns."
        )
        .build();

      insights.push({
        id: `insight-${asset.id}-timing`,
        assetId: asset.id,
        type: "timing",
        title: "Early Momentum Suggests Timing Alignment",
        description,
        confidence: "medium",
      });
    }
  }

  return insights;
}

export function generatePlatformRecommendations(
  asset: OrganicContentAsset,
  momentumState: OrganicMomentumState
): PlatformRecommendation[] {
  const recommendations: PlatformRecommendation[] = [];
  const signals = extractCreativeSignals(asset);

  // Current platform recommendation
  if (momentumState.platformFit === "high") {
    recommendations.push({
      platform: asset.platform,
      reasoning: `Strong platform-native fit detected. Creative signals align well with ${asset.platform} audience expectations.`,
      creativeGuidance: [
        `Continue leveraging ${signals.pacingCategory} pacing`,
        `Maintain ${signals.visualDominance} visual focus`,
        `Build on the ${signals.toneCategory} tone that's resonating`,
      ],
    });
  }

  // Cross-platform recommendations (future extension placeholder)
  // TODO: Add trend/moment detection for cross-platform strategy

  return recommendations;
}

