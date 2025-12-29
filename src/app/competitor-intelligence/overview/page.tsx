"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { demoCompetitors } from "@/lib/competitor/demo-data/competitors";
import { demoCompetitorContent } from "@/lib/competitor/demo-data/competitor-content";
import { analyzeEmphasis } from "@/lib/competitor/intelligence/emphasis-analyzer";
import { detectTemporalShifts } from "@/lib/competitor/intelligence/temporal-shift-detector";
import { CompetitorCard } from "@/components/cards/CompetitorCard";
import { CreativeSignalBadge } from "@/components/badges/CreativeSignalBadge";

export default function CompetitorIntelligenceOverviewPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");

  const competitorData = useMemo(() => {
    return demoCompetitors.map((competitor) => {
      const competitorAssets = demoCompetitorContent.filter(
        (asset) => asset.competitorId === competitor.id
      );

      const filteredAssets =
        selectedPlatform === "all"
          ? competitorAssets
          : competitorAssets.filter((asset) => asset.platform === selectedPlatform);

      const emphasisPatterns = analyzeEmphasis(filteredAssets);
      const dominantThemes = emphasisPatterns
        .slice(0, 5)
        .map((p) => p.signalName);

      const temporalShifts = detectTemporalShifts(competitor.id, competitorAssets);
      const recentShifts = temporalShifts.filter(
        (t) => t.trendDirection !== "stable"
      ).length;

      return {
        competitor,
        dominantThemes,
        recentShifts,
        emphasisPatterns,
        temporalShifts,
      };
    });
  }, [selectedPlatform]);

  const allShifts = useMemo(() => {
    return competitorData.flatMap((data) => data.temporalShifts);
  }, [competitorData]);

  const recentShifts = allShifts
    .filter((shift) => shift.trendDirection !== "stable")
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Competitor Intelligence Overview</h1>
        <p className="text-muted-foreground mt-2">
          Track and analyze external competitors' creative signals and narrative patterns
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant={selectedPlatform === "all" ? "default" : "outline"}
          onClick={() => setSelectedPlatform("all")}
        >
          All Platforms
        </Button>
        <Button
          type="button"
          variant={selectedPlatform === "Instagram" ? "default" : "outline"}
          onClick={() => setSelectedPlatform("Instagram")}
        >
          Instagram
        </Button>
        <Button
          type="button"
          variant={selectedPlatform === "TikTok" ? "default" : "outline"}
          onClick={() => setSelectedPlatform("TikTok")}
        >
          TikTok
        </Button>
        <Button
          type="button"
          variant={selectedPlatform === "YouTube" ? "default" : "outline"}
          onClick={() => setSelectedPlatform("YouTube")}
        >
          YouTube
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Competitors</h2>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {competitorData.map(({ competitor, dominantThemes, recentShifts }) => (
              <CompetitorCard
                key={competitor.id}
                competitor={competitor}
                dominantThemes={dominantThemes}
                recentShifts={recentShifts}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Signal Shifts</h2>
          <div className="space-y-3">
            {recentShifts.length === 0 ? (
              <p className="text-muted-foreground text-sm">No significant shifts detected</p>
            ) : (
              recentShifts.map((shift, index) => (
                <div key={index} className="p-3 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{shift.signalName}</span>
                    <CreativeSignalBadge
                      signalType={shift.signalType}
                      signalName={shift.trendDirection}
                      frequency={shift.frequency}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {shift.competitorId} • {shift.signalType}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

