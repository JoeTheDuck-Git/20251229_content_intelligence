"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CapabilitySummaryPanel } from "@/components/creative-performance/CapabilitySummaryPanel";
import { CreativeTagCard } from "@/components/creative-performance/CreativeTagCard";
import { FormatStrengthIndicator } from "@/components/creative-performance/FormatStrengthIndicator";
import { StabilityBadge } from "@/components/creative-performance/StabilityBadge";
import { ConfidenceIndicator } from "@/components/creative-performance/ConfidenceIndicator";
import { MarketContextBadge } from "@/components/creative-performance/MarketContextBadge";
import { MarketConfidenceIndicator } from "@/components/creative-performance/MarketConfidenceIndicator";
import { CompetitorSignalTooltip } from "@/components/creative-performance/CompetitorSignalTooltip";
import { TimePerspectiveSelector } from "@/components/creative-performance/TimePerspectiveSelector";
import { analyzeCrossFormatCapability, analyzeTagPerformanceAcrossFormats } from "@/lib/creative-performance/cross-format-intelligence";
import { analyzeCrossFormatMarketContext } from "@/lib/creative-performance/market-context-intelligence";
import { generateTagEvolutionInsight, getStabilityForPerspective } from "@/lib/creative-performance/time-perspective-interpreter";
import { generateCrossFormatTagInsight } from "@/lib/creative-performance/creative-tag-insight-generator";
import { InsightSentenceBuilder } from "@/lib/insight-language/insight-sentence-framework";
import { demoAdsAssets } from "@/lib/demo-data/ads-assets";
import { demoOrganicAssets } from "@/lib/organic/demo-data/organic-assets";
import { demoCompetitorContent } from "@/lib/competitor/demo-data/competitor-content";
import { TimePerspective } from "@/types/creative-performance";

export default function CrossFormatCreativeOverviewPage() {
  const [timePerspective, setTimePerspective] = useState<TimePerspective>("Recent");

  const intelligence = useMemo(() => {
    const capability = analyzeCrossFormatCapability(demoAdsAssets, demoOrganicAssets);
    const tagPerformance = analyzeTagPerformanceAcrossFormats(demoAdsAssets, demoOrganicAssets);
    const marketContext = analyzeCrossFormatMarketContext(tagPerformance, demoCompetitorContent);

    return { capability, tagPerformance, marketContext };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Cross-Format Creative Performance Overview</h1>
          <p className="text-muted-foreground">
            Creative elements that perform consistently across text, image, and video formats
          </p>
        </div>
        <TimePerspectiveSelector value={timePerspective} onChange={setTimePerspective} />
      </div>

      {/* Insight Notice */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="text-lg">Insight Notice</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            Insights explain observed creative behavior across contexts.
            They do not prescribe execution rules.
          </p>
        </CardContent>
      </Card>

      {/* A. Cross-Format Strength Summary */}
      <CapabilitySummaryPanel
        textStrength={intelligence.capability.textStrength}
        imageStrength={intelligence.capability.imageStrength}
        videoStrength={intelligence.capability.videoStrength}
        overallStability={intelligence.capability.overallStability}
      />

      {/* B. Creative Tag Performance Across Formats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Creative Tag Performance Across Formats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {intelligence.tagPerformance.map((tag) => {
              const evolutionInsight = generateTagEvolutionInsight(
                tag.tagName,
                tag.formatStrengths[0]?.strength || "mixed",
                tag.crossFormatConsistency,
                intelligence.marketContext.some((m) => m.tagName === tag.tagName)
              );
              const perspectiveStability = getStabilityForPerspective(
                evolutionInsight.stability,
                timePerspective
              );
              
              // 生成 Creative Insight
              const creativeInsight = generateCrossFormatTagInsight(tag);

              return (
                <CreativeTagCard
                  key={tag.tagId}
                  tagName={tag.tagName}
                  category="Hook Type"
                >
                  <div className="space-y-3">
                    <div className="space-y-2">
                      {tag.formatStrengths.map((format) => (
                        <FormatStrengthIndicator
                          key={format.format}
                          format={format.format}
                          strength={format.strength}
                          stability={format.stability}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Cross-format consistency:</span>
                        <StabilityBadge stability={tag.crossFormatConsistency} />
                      </div>
                      <ConfidenceIndicator confidence={tag.overallConfidence} />
                    </div>
                    {/* Pattern Insight */}
                    <div className="pt-2 border-t">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Pattern Insight:</p>
                      <p className="text-xs text-muted-foreground italic">
                        {creativeInsight.insightText}
                      </p>
                    </div>
                    <div className="pt-2 border-t space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Time-based classification:</span>
                        <Badge variant="outline" className="text-xs">
                          {evolutionInsight.classification}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Stability ({timePerspective}):</span>
                        <Badge
                          variant="outline"
                          className={
                            perspectiveStability === "strong"
                              ? "bg-green-100 text-green-800 border-green-300"
                              : perspectiveStability === "mixed"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                              : "bg-gray-100 text-gray-800 border-gray-300"
                          }
                        >
                          {perspectiveStability.charAt(0).toUpperCase() + perspectiveStability.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground italic">
                        {evolutionInsight.interpretation}
                      </p>
                      {evolutionInsight.marketContextNote && (
                        <p className="text-xs text-purple-600 italic">
                          {evolutionInsight.marketContextNote}
                        </p>
                      )}
                    </div>
                  </div>
                </CreativeTagCard>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* C. Market Context (Competitor Signals) */}
      <Card className="border-purple-200 bg-purple-50/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span>Market Context</span>
            <span className="text-sm font-normal text-muted-foreground">(Competitor Signals)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {intelligence.marketContext.map((signal) => {
              // 為 market context signal 生成 insight
              const builder = new InsightSentenceBuilder();
              builder.platformAlignmentObservation(
                signal.tagName,
                "market",
                `market presence (${signal.marketPresence})`,
                "observed competitor usage patterns"
              );
              const marketInsight = builder.build(1);

              return (
                <div key={signal.tagName} className="space-y-2 p-3 bg-background rounded-md border">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{signal.tagName}</span>
                    <div className="flex items-center gap-2">
                      <MarketContextBadge type="presence" value={signal.marketPresence} />
                      <MarketConfidenceIndicator confidence={signal.confidence} />
                    </div>
                  </div>
                  <CompetitorSignalTooltip explanation={signal.contextualExplanation} />
                  {/* Market Context Insight */}
                  <p className="text-xs text-muted-foreground italic mt-2">
                    {marketInsight}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* D. Format-Specific Creative Strength Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Format-Specific Creative Strength Patterns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Video-specific strengths</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {intelligence.capability.formatSpecificPatterns.video.map((pattern, i) => (
                <li key={i}>{pattern}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Image-specific strengths</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {intelligence.capability.formatSpecificPatterns.image.map((pattern, i) => (
                <li key={i}>{pattern}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Text-specific strengths</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {intelligence.capability.formatSpecificPatterns.text.map((pattern, i) => (
                <li key={i}>{pattern}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* E. Confidence & Scope Disclosure */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-lg">Confidence & Scope Disclosure</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Data coverage:</strong> Analysis based on aggregated paid and organic creative signals
            across {demoAdsAssets.length} paid assets and {demoOrganicAssets.length} organic assets.
          </p>
          <p>
            <strong>Interpretation limits:</strong> Cross-format capability reflects observed performance
            patterns. Format-specific strengths are descriptive of current data patterns, not predictive
            of future performance.
          </p>
          <p className="pt-2 border-t">
            <strong>Market context:</strong> Market context reflects observed competitor usage patterns.
            It does not indicate performance or effectiveness.
          </p>
          <p className="pt-2 border-t">
            <strong>Time-based interpretation:</strong> Time-based interpretation reflects aggregated creative patterns over defined periods.
            It does not represent real-time performance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

