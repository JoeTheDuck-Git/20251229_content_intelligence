"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreativeTagCard } from "@/components/creative-performance/CreativeTagCard";
import { StabilityBadge } from "@/components/creative-performance/StabilityBadge";
import { ConfidenceIndicator } from "@/components/creative-performance/ConfidenceIndicator";
import { MarketContextBadge } from "@/components/creative-performance/MarketContextBadge";
import { MarketConfidenceIndicator } from "@/components/creative-performance/MarketConfidenceIndicator";
import { CompetitorSignalTooltip } from "@/components/creative-performance/CompetitorSignalTooltip";
import { TimePerspectiveSelector } from "@/components/creative-performance/TimePerspectiveSelector";
import { analyzeOrganicResonanceHealth, analyzeOrganicTagResonance } from "@/lib/creative-performance/organic-intelligence";
import { analyzeOrganicMarketContext } from "@/lib/creative-performance/market-context-intelligence";
import { generateTagEvolutionInsight, getStabilityForPerspective } from "@/lib/creative-performance/time-perspective-interpreter";
import { generateOrganicTagInsight } from "@/lib/creative-performance/creative-tag-insight-generator";
import { InsightSentenceBuilder } from "@/lib/insight-language/insight-sentence-framework";
import { demoOrganicAssets } from "@/lib/organic/demo-data/organic-assets";
import { demoOrganicMetrics } from "@/lib/organic/demo-data/organic-metrics";
import { generateMomentumState } from "@/lib/organic/momentum-intelligence/lifecycle-classifier";
import { demoCompetitorContent } from "@/lib/competitor/demo-data/competitor-content";
import { AlertCircle } from "lucide-react";
import { TimePerspective } from "@/types/creative-performance";

export default function OrganicCreativePerformancePage() {
  const [timePerspective, setTimePerspective] = useState<TimePerspective>("Recent");

  const intelligence = useMemo(() => {
    const metricsMap = new Map<string, typeof demoOrganicMetrics[0][]>();
    const momentumMap = new Map();

    demoOrganicMetrics.forEach((metric) => {
      const existing = metricsMap.get(metric.assetId) || [];
      existing.push(metric);
      metricsMap.set(metric.assetId, existing);
    });

    demoOrganicAssets.forEach((asset) => {
      const metrics = metricsMap.get(asset.id) || [];
      if (metrics.length > 0) {
        const momentumState = generateMomentumState(asset, metrics);
        momentumMap.set(asset.id, momentumState);
      }
    });

    const health = analyzeOrganicResonanceHealth(demoOrganicAssets, metricsMap, momentumMap);
    const tagResonance = analyzeOrganicTagResonance(demoOrganicAssets, metricsMap, momentumMap);
    const marketContext = analyzeOrganicMarketContext(tagResonance, demoCompetitorContent);

    return { health, tagResonance, marketContext };
  }, []);

  const strengthColors = {
    strong: "bg-green-100 text-green-800 border-green-300",
    mixed: "bg-yellow-100 text-yellow-800 border-yellow-300",
    weak: "bg-gray-100 text-gray-800 border-gray-300",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Organic Creative Performance Overview</h1>
          <p className="text-muted-foreground">
            Creative elements that naturally resonate and sustain engagement
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

      {/* A. Organic Resonance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Organic Resonance Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overall organic creative strength</span>
            <Badge variant="outline" className={strengthColors[intelligence.health.overallStrength]}>
              {intelligence.health.overallStrength.charAt(0).toUpperCase() +
                intelligence.health.overallStrength.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Momentum stability</span>
            <StabilityBadge stability={intelligence.health.momentumStability} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Long-tail potential</span>
            <Badge
              variant="outline"
              className={
                intelligence.health.longTailPotential === "strong"
                  ? "bg-green-100 text-green-800 border-green-300"
                  : intelligence.health.longTailPotential === "moderate"
                  ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                  : "bg-gray-100 text-gray-800 border-gray-300"
              }
            >
              {intelligence.health.longTailPotential.charAt(0).toUpperCase() +
                intelligence.health.longTailPotential.slice(1)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* B. Creative Tag Resonance Map */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Creative Tag Resonance Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {intelligence.tagResonance.map((tag) => {
              const evolutionInsight = generateTagEvolutionInsight(
                tag.tagName,
                tag.engagementStrength,
                tag.momentumConsistency,
                intelligence.marketContext.some((m) => m.tagName === tag.tagName)
              );
              const perspectiveStability = getStabilityForPerspective(
                evolutionInsight.stability,
                timePerspective
              );
              
              // 生成 Creative Insight
              const creativeInsight = generateOrganicTagInsight(tag);

              return (
                <CreativeTagCard
                  key={tag.tagId}
                  tagName={tag.tagName}
                  category="Hook Type"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Engagement strength</span>
                      <Badge variant="outline" className={strengthColors[tag.engagementStrength]}>
                        {tag.engagementStrength.charAt(0).toUpperCase() + tag.engagementStrength.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Momentum consistency</span>
                      <StabilityBadge stability={tag.momentumConsistency} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Long-tail signal</span>
                      <Badge
                        variant="outline"
                        className={
                          tag.longTailSignal === "strong"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : tag.longTailSignal === "moderate"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                            : "bg-gray-100 text-gray-800 border-gray-300"
                        }
                      >
                        {tag.longTailSignal.charAt(0).toUpperCase() + tag.longTailSignal.slice(1)}
                      </Badge>
                    </div>
                    <div className="pt-2 border-t">
                      <ConfidenceIndicator confidence={tag.confidence} />
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
                        <span className="text-sm text-muted-foreground">Resonance stability ({timePerspective}):</span>
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

      {/* C. Organic Market Context Signals */}
      <Card className="border-purple-200 bg-purple-50/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span>Organic Market Context Signals</span>
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
                `market usage (${signal.marketUsage})`,
                "observed competitor usage patterns"
              );
              const marketInsight = builder.build(1);

              return (
                <div key={signal.tagId} className="space-y-2 p-3 bg-background rounded-md border">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{signal.tagName}</span>
                    <div className="flex items-center gap-2">
                      <MarketContextBadge type="usage" value={signal.marketUsage} />
                      <MarketConfidenceIndicator confidence={signal.confidence} />
                    </div>
                  </div>
                  <CompetitorSignalTooltip explanation={signal.explanation} />
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

      {/* D. Moment vs Evergreen Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Moment vs Evergreen Patterns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h3 className="font-medium mb-2 text-sm">Tags driven by short-term moments</h3>
            <div className="space-y-1">
              {intelligence.tagResonance
                .filter((tag) => tag.momentDriven)
                .map((tag) => (
                  <div key={tag.tagId} className="text-sm text-muted-foreground">
                    • {tag.tagName} shows momentum tied to specific moments or trends
                  </div>
                ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2 text-sm">Tags with sustained relevance</h3>
            <div className="space-y-1">
              {intelligence.tagResonance
                .filter((tag) => tag.evergreenPotential)
                .map((tag) => (
                  <div key={tag.tagId} className="text-sm text-muted-foreground">
                    • {tag.tagName} demonstrates consistent engagement over time
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* E. Organic Context Notice */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Organic Context Notice</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            This view reflects natural audience response, not paid amplification. Resonance metrics
            describe observed organic engagement patterns and do not indicate paid media efficiency
            or scalability potential.
          </p>
          <p className="pt-2 border-t">
            <strong>Market context:</strong> Market context reflects observed competitor usage patterns.
            It does not indicate performance or effectiveness. Market usage levels do not suggest
            engagement quality or recommend following trends.
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

