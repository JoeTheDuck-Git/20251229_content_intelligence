"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CompetitorSignal } from "@/types/competitor";
import { MarketContextAnalysis } from "@/types/competitor";

interface MarketContextSnapshotProps {
  marketContext: MarketContextAnalysis;
  highConfidenceSignals: CompetitorSignal[];
}

export function MarketContextSnapshot({
  marketContext,
  highConfidenceSignals,
}: MarketContextSnapshotProps) {
  const alignmentLabels = {
    aligned: "Aligned",
    crowded: "Crowded",
    divergent: "Divergent",
  };

  const alignmentDescriptions = {
    aligned: "Internal strengths align with observed market patterns.",
    crowded: "Internal strengths operate in a crowded creative context.",
    divergent: "Internal strengths diverge from prevailing market patterns.",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Market Context Snapshot</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          How this capability sits within the market
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Alignment */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Overall Market Alignment</span>
            <Badge
              variant={
                marketContext.overallAlignment === "aligned"
                  ? "default"
                  : marketContext.overallAlignment === "crowded"
                  ? "secondary"
                  : "outline"
              }
            >
              {alignmentLabels[marketContext.overallAlignment]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {alignmentDescriptions[marketContext.overallAlignment]}
          </p>
        </div>

        {/* Aligned Strengths */}
        {marketContext.overrepresentedTags.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm mb-2">Crowded Creative Territories</h3>
            <ul className="space-y-1.5">
              {marketContext.overrepresentedTags
                .filter((s) => s.confidence === "high")
                .slice(0, 3)
                .map((signal) => (
                  <li key={signal.tagName} className="text-sm text-muted-foreground">
                    • {signal.tagName} operates in a crowded creative context
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Differentiated Strengths */}
        {marketContext.underrepresentedTags.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm mb-2">Differentiated Creative Patterns</h3>
            <ul className="space-y-1.5">
              {marketContext.underrepresentedTags
                .filter((s) => s.confidence === "high")
                .slice(0, 3)
                .map((signal) => (
                  <li key={signal.tagName} className="text-sm text-muted-foreground">
                    • {signal.tagName} is less common in observed market patterns
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Saturation Risk */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Market Saturation Risk</span>
            <Badge
              variant={
                marketContext.saturationRisk === "high"
                  ? "destructive"
                  : marketContext.saturationRisk === "medium"
                  ? "secondary"
                  : "outline"
              }
            >
              {marketContext.saturationRisk.charAt(0).toUpperCase() + marketContext.saturationRisk.slice(1)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {marketContext.saturationRisk === "high"
              ? "Market context suggests increased competition in core creative territories."
              : marketContext.saturationRisk === "medium"
              ? "Moderate saturation observed in some creative patterns."
              : "Low saturation risk in current creative territories."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

