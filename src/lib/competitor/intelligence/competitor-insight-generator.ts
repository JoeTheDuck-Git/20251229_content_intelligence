import { CompetitorContentAsset, CompetitorInsight } from "@/types/competitor";
import { analyzeEmphasis } from "./emphasis-analyzer";
import { detectTemporalShifts } from "./temporal-shift-detector";
import { InsightSentenceBuilder } from "@/lib/insight-language/insight-sentence-framework";

export function generateCompetitorInsights(
  competitorId: string,
  assets: CompetitorContentAsset[]
): CompetitorInsight[] {
  const insights: CompetitorInsight[] = [];
  const emphasisPatterns = analyzeEmphasis(assets);
  const temporalShifts = detectTemporalShifts(competitorId, assets);

  // Generate emphasis shift insights
  const emergingSignals = temporalShifts.filter((t) => t.trendDirection === "emerging");
  if (emergingSignals.length > 0) {
    const topEmerging = emergingSignals
      .sort((a, b) => (b.changePercentage || 0) - (a.changePercentage || 0))
      .slice(0, 3);

    topEmerging.forEach((signal, index) => {
      const builder = new InsightSentenceBuilder();
      const description = builder
        .metricObservation(
          "Emphasis increase",
          signal.changePercentage || 0,
          `this competitor is increasing emphasis on ${signal.signalName}-related messaging`
        )
        .temporalStabilityFraming(
          "this competitor",
          "emerging",
          `Recent content shows ${signal.changePercentage?.toFixed(0)}% more frequent use of this signal compared to the previous period.`
        )
        .build();

      insights.push({
        id: `insight-${competitorId}-emphasis-${index}`,
        competitorId,
        type: "emphasis_shift",
        title: `Increased emphasis on ${signal.signalName}`,
        description,
        observedDate: new Date().toISOString().split("T")[0],
        confidence: signal.changePercentage && signal.changePercentage > 30 ? "high" : "medium",
      });
    });
  }

  // Generate narrative change insights
  const narrativePatterns = emphasisPatterns.filter((p) => p.signalType === "narrative");
  if (narrativePatterns.length > 0) {
    const dominantNarrative = narrativePatterns[0];
    const narrativeShifts = temporalShifts.filter(
      (t) => t.signalType === "narrative" && t.trendDirection !== "stable"
    );

    if (narrativeShifts.length > 0) {
      const builder = new InsightSentenceBuilder();
      const description = builder
        .temporalStabilityFraming(
          "this competitor",
          "emerging",
          `Recent content shifts toward ${dominantNarrative.signalName}-focused narratives.`
        )
        .metricObservation(
          "Narrative representation",
          dominantNarrative.percentage,
          `this represents ${dominantNarrative.percentage.toFixed(0)}% of observed content`
        )
        .build();

      insights.push({
        id: `insight-${competitorId}-narrative`,
        competitorId,
        type: "narrative_change",
        title: `Narrative shift toward ${dominantNarrative.signalName}`,
        description,
        observedDate: new Date().toISOString().split("T")[0],
        confidence: dominantNarrative.percentage > 40 ? "high" : "medium",
      });
    }
  }

  // Generate keyword emergence insights
  const keywordShifts = temporalShifts.filter(
    (t) => t.signalType === "keyword" && t.trendDirection === "emerging"
  );
  if (keywordShifts.length > 0) {
    const topKeyword = keywordShifts[0];
    const builder = new InsightSentenceBuilder();
    const description = builder
      .temporalStabilityFraming(
        "this competitor",
        "emerging",
        `The keyword "${topKeyword.signalName}" appears more frequently in recent content, suggesting increased focus on this theme.`
      )
      .build();

    insights.push({
      id: `insight-${competitorId}-keyword`,
      competitorId,
      type: "keyword_emergence",
      title: `Emerging keyword: "${topKeyword.signalName}"`,
      description,
      observedDate: new Date().toISOString().split("T")[0],
      confidence: topKeyword.changePercentage && topKeyword.changePercentage > 25 ? "high" : "medium",
    });
  }

  // Generate visual evolution insights
  const visualShifts = temporalShifts.filter(
    (t) => t.signalType === "visual" && t.trendDirection !== "stable"
  );
  if (visualShifts.length > 0) {
    const topVisual = visualShifts[0];
    const builder = new InsightSentenceBuilder();
    const description = builder
      .temporalStabilityFraming(
        "this competitor",
        "emerging",
        `Recent content shows a shift in visual focus toward ${topVisual.signalName}, indicating a change in creative presentation style.`
      )
      .build();

    insights.push({
      id: `insight-${competitorId}-visual`,
      competitorId,
      type: "visual_evolution",
      title: `Visual focus shift toward ${topVisual.signalName}`,
      description,
      observedDate: new Date().toISOString().split("T")[0],
      confidence: Math.abs(topVisual.changePercentage || 0) > 30 ? "high" : "medium",
    });
  }

  return insights;
}

