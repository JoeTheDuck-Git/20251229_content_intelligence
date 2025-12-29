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
import { analyzePaidCreativeHealth, analyzePaidTagEfficiency } from "@/lib/creative-performance/paid-intelligence";
import { analyzePaidMarketContext } from "@/lib/creative-performance/market-context-intelligence";
import { generateTagEvolutionInsight, getStabilityForPerspective } from "@/lib/creative-performance/time-perspective-interpreter";
import { generatePaidTagInsight } from "@/lib/creative-performance/creative-tag-insight-generator";
import { InsightSentenceBuilder } from "@/lib/insight-language/insight-sentence-framework";
import { demoAdsAssets } from "@/lib/demo-data/ads-assets";
import { demoAdsPerformanceMetrics } from "@/lib/demo-data/ads-performance-metrics";
import { getMetricsByAssetId } from "@/lib/fatigue-intelligence/get-fatigue-data";
import { analyzeFatigue } from "@/lib/fatigue-intelligence/analyze-fatigue";
import { demoCompetitorContent } from "@/lib/competitor/demo-data/competitor-content";
import { AlertCircle } from "lucide-react";
import { TimePerspective } from "@/types/creative-performance";

export default function PaidCreativePerformancePage() {
  const [timePerspective, setTimePerspective] = useState<TimePerspective>("Recent");

  const intelligence = useMemo(() => {
    const metricsMap = new Map<string, typeof demoAdsPerformanceMetrics[0][]>();
    const fatigueMap = new Map();

    demoAdsPerformanceMetrics.forEach((metric) => {
      const existing = metricsMap.get(metric.assetId) || [];
      existing.push(metric);
      metricsMap.set(metric.assetId, existing);
    });

    demoAdsAssets.forEach((asset) => {
      const metrics = getMetricsByAssetId(asset.id);
      if (metrics.length > 0) {
        const fatigue = analyzeFatigue(asset.id, metrics);
        fatigueMap.set(asset.id, fatigue);
      }
    });

    const health = analyzePaidCreativeHealth(demoAdsAssets, metricsMap, fatigueMap);
    const tagEfficiency = analyzePaidTagEfficiency(demoAdsAssets, metricsMap, fatigueMap);
    const marketContext = analyzePaidMarketContext(tagEfficiency, demoCompetitorContent);

    return { health, tagEfficiency, marketContext };
  }, []);

  const healthColors = {
    healthy: "bg-green-100 text-green-800 border-green-300",
    moderate: "bg-yellow-100 text-yellow-800 border-yellow-300",
    "at-risk": "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Paid Creative Performance Overview</h1>
          <p className="text-muted-foreground">
            Creative elements that can be reliably scaled with paid media
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

      {/* A. Paid Creative Efficiency Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Paid Creative Efficiency Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overall paid creative health</span>
            <Badge
              variant="outline"
              className={healthColors[intelligence.health.overallHealth]}
            >
              {intelligence.health.overallHealth.charAt(0).toUpperCase() +
                intelligence.health.overallHealth.slice(1).replace("-", " ")}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Efficiency stability</span>
            <StabilityBadge stability={intelligence.health.efficiencyStability} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Creative concentration risk</span>
            <Badge
              variant="outline"
              className={
                intelligence.health.concentrationRisk === "high"
                  ? "bg-red-100 text-red-800 border-red-300"
                  : intelligence.health.concentrationRisk === "medium"
                  ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                  : "bg-green-100 text-green-800 border-green-300"
              }
            >
              {intelligence.health.concentrationRisk.charAt(0).toUpperCase() +
                intelligence.health.concentrationRisk.slice(1)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* B. Creative Tag Efficiency Map */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Creative Tag Efficiency Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {intelligence.tagEfficiency.map((tag) => {
              const evolutionInsight = generateTagEvolutionInsight(
                tag.tagName,
                tag.efficiencyStrength === "high" ? "strong" : tag.efficiencyStrength === "medium" ? "mixed" : "weak",
                tag.stabilityUnderSpend,
                intelligence.marketContext.some((m) => m.tagName === tag.tagName)
              );
              const perspectiveStability = getStabilityForPerspective(
                evolutionInsight.stability,
                timePerspective
              );
              
              // 生成 Creative Insight
              const creativeInsight = generatePaidTagInsight(tag);

              return (
                <CreativeTagCard
                  key={tag.tagId}
                  tagName={tag.tagName}
                  category="Hook Type"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Paid efficiency strength</span>
                      <Badge
                        variant="outline"
                        className={
                          tag.efficiencyStrength === "high"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : tag.efficiencyStrength === "medium"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                            : "bg-gray-100 text-gray-800 border-gray-300"
                        }
                      >
                        {tag.efficiencyStrength.charAt(0).toUpperCase() + tag.efficiencyStrength.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Stability under spend</span>
                      <StabilityBadge stability={tag.stabilityUnderSpend} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Fatigue sensitivity</span>
                      <Badge
                        variant="outline"
                        className={
                          tag.fatigueSensitivity === "high"
                            ? "bg-red-100 text-red-800 border-red-300"
                            : tag.fatigueSensitivity === "medium"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                            : "bg-green-100 text-green-800 border-green-300"
                        }
                      >
                        {tag.fatigueSensitivity.charAt(0).toUpperCase() + tag.fatigueSensitivity.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-muted-foreground">Scale reliability</span>
                      <Badge
                        variant="outline"
                        className={
                          tag.scaleReliability === "reliable"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : tag.scaleReliability === "moderate"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                            : "bg-gray-100 text-gray-800 border-gray-300"
                        }
                      >
                        {tag.scaleReliability.charAt(0).toUpperCase() + tag.scaleReliability.slice(1)}
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
                        <span className="text-sm text-muted-foreground">Efficiency stability ({timePerspective}):</span>
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

      {/* C. Paid Market Context Signals */}
      <Card className="border-purple-200 bg-purple-50/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span>Paid Market Context Signals</span>
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
                `market saturation (${signal.marketSaturation})`,
                "observed competitor usage patterns"
              );
              const marketInsight = builder.build(1);

              return (
                <div key={signal.tagId} className="space-y-2 p-3 bg-background rounded-md border">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{signal.tagName}</span>
                    <div className="flex items-center gap-2">
                      <MarketContextBadge type="saturation" value={signal.marketSaturation} />
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

      {/* D. Scale Reliability Signals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Scale Reliability Signals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h3 className="font-medium mb-2 text-sm">Tags that remain efficient at higher exposure</h3>
            <div className="space-y-1">
              {intelligence.tagEfficiency
                .filter((tag) => tag.scaleReliability === "reliable")
                .map((tag) => (
                  <div key={tag.tagId} className="text-sm text-muted-foreground">
                    • {tag.tagName} maintains efficiency strength under increased spend
                  </div>
                ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2 text-sm">Tags that decay quickly</h3>
            <div className="space-y-1">
              {intelligence.tagEfficiency
                .filter((tag) => tag.fatigueSensitivity === "high" || tag.scaleReliability === "unreliable")
                .map((tag) => (
                  <div key={tag.tagId} className="text-sm text-muted-foreground">
                    • {tag.tagName} shows efficiency decline with increased exposure
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* E. Paid Context Notice */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Paid Context Notice</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            This view reflects paid media efficiency, not creative potential. Efficiency metrics
            describe observed performance under paid amplification and do not indicate inherent
            creative quality or organic resonance.
          </p>
          <p className="pt-2 border-t">
            <strong>Market context:</strong> Market context reflects observed competitor usage patterns.
            It does not indicate performance or effectiveness. Market saturation does not imply
            efficiency or suggest strategic direction.
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

