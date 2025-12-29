import { Insight, Recommendation, ContentAsset, AdsMetrics, Measurement } from "@/types";
import { getLatestAdsMetrics, calculateAverageROAS } from "@/lib/ads/get-ads-metrics";
import { getMeasurementByAssetId } from "@/lib/measurement/get-measurement";
import { getAdsMetricsByAssetId } from "@/lib/ads/get-ads-metrics";
import { InsightSentenceBuilder } from "@/lib/insight-language/insight-sentence-framework";

export function generateInsights(assetId: string): Insight[] {
  const latestMetrics = getLatestAdsMetrics(assetId);
  const measurement = getMeasurementByAssetId(assetId);
  const allMetrics = getAdsMetricsByAssetId(assetId);

  if (!latestMetrics || !measurement) return [];

  const insights: Insight[] = [];

  // Rule-based insight: High CTR but low ROAS
  if (latestMetrics.ctr > 5 && latestMetrics.roas < 3) {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .conversionGapObservation(latestMetrics.ctr, latestMetrics.roas, "post-click alignment factors differ")
      .build();

    insights.push({
      id: `insight-${assetId}-1`,
      type: "warning",
      title: "High CTR but Low ROAS Detected",
      description,
      assetId,
      priority: "high",
    });
  }

  // Rule-based insight: Creative fatigue
  if (measurement.creativeFatigue) {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .temporalStabilityFraming(
        "this creative",
        "declining",
        "Performance is declining over multiple spend cycles in observed contexts."
      )
      .build();

    insights.push({
      id: `insight-${assetId}-2`,
      type: "warning",
      title: "Creative Fatigue Detected",
      description,
      assetId,
      priority: "high",
    });
  }

  // Rule-based insight: High scaling potential
  if (measurement.scalePotential === "high" && latestMetrics.roas > 4) {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .distributionContextFraming(
        "this creative",
        "paid",
        `high engagement scores and strong ROAS (${latestMetrics.roas.toFixed(1)}x) are maintained`
      )
      .temporalStabilityFraming(
        "this creative",
        "stable",
        "Performance demonstrates consistent stability over time."
      )
      .build();

    insights.push({
      id: `insight-${assetId}-3`,
      type: "positive",
      title: "Strong Scaling Potential",
      description,
      assetId,
      priority: "high",
    });
  }

  // Rule-based insight: ROAS trend analysis
  if (allMetrics.length >= 3) {
    const recentROAS = allMetrics.slice(-3).map((m) => m.roas);
    const isDeclining = recentROAS[0] > recentROAS[1] && recentROAS[1] > recentROAS[2];

    if (isDeclining) {
      const builder = new InsightSentenceBuilder();
      const description = builder
        .temporalStabilityFraming(
          "this creative",
          "declining",
          "ROAS has been decreasing over the last 3 cycles, which may indicate audience saturation or creative fatigue patterns."
        )
        .build();

      insights.push({
        id: `insight-${assetId}-4`,
        type: "warning",
        title: "ROAS Declining Trend",
        description,
        assetId,
        priority: "medium",
      });
    }
  }

  // Rule-based insight: Hook performance
  if (measurement.hookScore > 9) {
    const builder = new InsightSentenceBuilder();
    const description = builder
      .metricObservation(
        "Hook performance",
        measurement.hookScore,
        "this hook type demonstrates strong alignment with observed contexts"
      )
      .build();

    insights.push({
      id: `insight-${assetId}-5`,
      type: "positive",
      title: "Exceptional Hook Performance",
      description,
      assetId,
      priority: "medium",
    });
  }

  return insights;
}

export function generateRecommendations(assetId: string, asset: ContentAsset): Recommendation {
  const measurement = getMeasurementByAssetId(assetId);
  const latestMetrics = getLatestAdsMetrics(assetId);

  // Rule-based recommendations (mock AI logic)
  let recommendedLength = 30;
  let recommendedHook = "Question Hook";
  let recommendedPacing = "Fast";
  let reasoning = "";

  if (asset.platform === "TikTok") {
    recommendedLength = 30;
    recommendedHook = "Problem-Solution";
    recommendedPacing = "Fast";
    reasoning = "TikTok audiences respond best to fast-paced, problem-solving hooks in 30-second formats.";
  } else if (asset.platform === "Meta") {
    recommendedLength = 15;
    recommendedHook = "Question Hook";
    recommendedPacing = "Medium";
    reasoning = "Meta ads perform best with engaging question hooks in shorter 15-second formats.";
  } else if (asset.platform === "YouTube") {
    recommendedLength = 45;
    recommendedHook = "Story Hook";
    recommendedPacing = "Medium";
    reasoning = "YouTube allows for longer-form storytelling with medium pacing for better engagement.";
  }

  // Adjust based on performance
  if (latestMetrics && latestMetrics.roas < 3) {
    recommendedPacing = "Fast";
    reasoning += " Fast pacing recommended to improve conversion rates.";
  }

  if (measurement && measurement.scalePotential === "high") {
    reasoning += " Current creative shows high scaling potential - maintain similar structure.";
  }

  return {
    videoLength: recommendedLength,
    hookType: recommendedHook,
    pacing: recommendedPacing,
    reasoning,
  };
}

export function getGlobalInsights(): Insight[] {
  // Future: AI Model Plug-in (Future)
  const builder1 = new InsightSentenceBuilder();
  const description1 = builder1
    .formatAware(
      "Question Hook type",
      "30-second video formats",
      "sequencing and pacing that aligns with observed engagement patterns"
    )
    .metricObservation(
      "ROAS performance",
      15,
      "Question Hook type demonstrates 15-20% higher ROAS in 30-second formats compared to other durations"
    )
    .build();

  const builder2 = new InsightSentenceBuilder();
  const description2 = builder2
    .conversionGapObservation(5, 3, "post-click alignment factors differ")
    .build();

  const builder3 = new InsightSentenceBuilder();
  const description3 = builder3
    .temporalStabilityFraming(
      "assets",
      "declining",
      "Assets showing declining ROAS over 3+ spend cycles demonstrate temporal sensitivity patterns."
    )
    .build();

  return [
    {
      id: "global-1",
      type: "positive",
      title: "Question Hooks Perform Best in 30-Second Videos",
      description: description1,
      priority: "medium",
    },
    {
      id: "global-2",
      type: "warning",
      title: "High CTR but Low ROAS Suggests Landing Page Mismatch",
      description: description2,
      priority: "high",
    },
    {
      id: "global-3",
      type: "recommendation",
      title: "Creative Fatigue Detected - Consider Refreshing Hooks",
      description: description3,
      priority: "medium",
    },
  ];
}

