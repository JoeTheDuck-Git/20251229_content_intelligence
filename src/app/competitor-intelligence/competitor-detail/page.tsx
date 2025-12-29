"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { demoCompetitors } from "@/lib/competitor/demo-data/competitors";
import { demoCompetitorContent } from "@/lib/competitor/demo-data/competitor-content";
import { analyzeEmphasis } from "@/lib/competitor/intelligence/emphasis-analyzer";
import { detectTemporalShifts } from "@/lib/competitor/intelligence/temporal-shift-detector";
import { generateCompetitorInsights } from "@/lib/competitor/intelligence/competitor-insight-generator";
import { CreativeSignalBadge } from "@/components/badges/CreativeSignalBadge";
import { NarrativeTrendIndicator } from "@/components/cards/NarrativeTrendIndicator";
import { InsightPanel } from "@/components/cards/InsightPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CompetitorDetailPage() {
  const searchParams = useSearchParams();
  const competitorId = searchParams.get("competitorId");

  const competitorData = useMemo(() => {
    if (!competitorId) return null;

    const competitor = demoCompetitors.find((c) => c.id === competitorId);
    if (!competitor) return null;

    const assets = demoCompetitorContent.filter(
      (asset) => asset.competitorId === competitorId
    );

    const emphasisPatterns = analyzeEmphasis(assets);
    const temporalShifts = detectTemporalShifts(competitorId, assets);
    const insights = generateCompetitorInsights(competitorId, assets);

    return {
      competitor,
      assets,
      emphasisPatterns,
      temporalShifts,
      insights,
    };
  }, [competitorId]);

  if (!competitorData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Competitor not found</p>
      </div>
    );
  }

  const { competitor, emphasisPatterns, temporalShifts, insights } = competitorData;

  const keywordPatterns = emphasisPatterns.filter((p) => p.signalType === "keyword");
  const hookPatterns = emphasisPatterns.filter((p) => p.signalType === "hook");
  const visualPatterns = emphasisPatterns.filter((p) => p.signalType === "visual");
  const narrativePatterns = emphasisPatterns.filter((p) => p.signalType === "narrative");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{competitor.brandName}</h1>
        <p className="text-muted-foreground mt-2">{competitor.category}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Keyword Emphasis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {keywordPatterns.slice(0, 10).map((pattern) => (
                <CreativeSignalBadge
                  key={pattern.signalName}
                  signalType="keyword"
                  signalName={pattern.signalName}
                  frequency={pattern.frequency}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hook Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {hookPatterns.map((pattern) => (
                <CreativeSignalBadge
                  key={pattern.signalName}
                  signalType="hook"
                  signalName={pattern.signalName}
                  frequency={pattern.frequency}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Visual Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {visualPatterns.map((pattern) => (
                <CreativeSignalBadge
                  key={pattern.signalName}
                  signalType="visual"
                  signalName={pattern.signalName}
                  frequency={pattern.frequency}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Narrative Angles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {narrativePatterns.map((pattern) => (
                <CreativeSignalBadge
                  key={pattern.signalName}
                  signalType="narrative"
                  signalName={pattern.signalName}
                  frequency={pattern.frequency}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Narrative Evolution Timeline</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {temporalShifts
            .filter((shift) => shift.trendDirection !== "stable")
            .map((shift, index) => (
              <NarrativeTrendIndicator
                key={index}
                signalName={shift.signalName}
                trendDirection={shift.trendDirection}
                changePercentage={shift.changePercentage}
                frequency={shift.frequency}
              />
            ))}
        </div>
      </div>

      <InsightPanel insights={insights} />
    </div>
  );
}

