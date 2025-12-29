"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoMoments } from "@/lib/trend/demo-data/moments";
import { demoOrganicAssets } from "@/lib/organic/demo-data/organic-assets";
import { demoOrganicMetrics } from "@/lib/organic/demo-data/organic-metrics";
import { MomentCard } from "@/components/cards/MomentCard";
import { AlignmentBadge } from "@/components/badges/AlignmentBadge";
import { findAlignedMoments } from "@/lib/trend/moment-analysis/alignment-detector";
import { generateTrendInsights } from "@/lib/trend/insight-engine/trend-insight-generator";
import { TrendInsightPanel } from "@/components/cards/TrendInsightPanel";
import { Badge } from "@/components/ui/badge";

export default function MomentDetailPage() {
  const searchParams = useSearchParams();
  const momentId = searchParams.get("id") || demoMoments[0]?.id || "";
  
  const moment = demoMoments.find((m) => m.id === momentId);
  
  if (!moment) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Moment Not Found</h1>
      </div>
    );
  }

  // Find all assets aligned with this moment
  const alignedAssets = demoOrganicAssets
    .map((asset) => {
      const alignments = findAlignedMoments(asset, [moment]);
      const alignment = alignments.find((a) => a.momentId === moment.id);
      if (alignment && alignment.alignmentStrength !== "none") {
        const metrics = demoOrganicMetrics.filter((m) => m.assetId === asset.id);
        const insights = generateTrendInsights(asset, metrics, [moment]);
        return { asset, alignment, metrics, insights };
      }
      return null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Moment Detail</h1>
        <p className="text-muted-foreground mt-2">
          Analyze content alignment with this moment
        </p>
      </div>

      <MomentCard moment={moment} />

      <Card>
        <CardHeader>
          <CardTitle>Aligned Content</CardTitle>
        </CardHeader>
        <CardContent>
          {alignedAssets.length > 0 ? (
            <div className="space-y-6">
              {alignedAssets.map(({ asset, alignment, insights }) => (
                <div key={asset.id} className="border-l-4 border-blue-500 pl-4 py-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{asset.title || asset.id}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{asset.platform}</Badge>
                        <Badge variant="outline">{asset.format}</Badge>
                        <AlignmentBadge strength={alignment.alignmentStrength} />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Timing Score</p>
                      <p className="text-xl font-bold">
                        {alignment.timingScore.toFixed(1)}/10
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Topic Relevance</p>
                      <p className="text-xl font-bold">
                        {alignment.topicRelevanceScore.toFixed(1)}/10
                      </p>
                    </div>
                  </div>
                  {insights.length > 0 && (
                    <TrendInsightPanel insights={insights} />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No content aligned with this moment.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

