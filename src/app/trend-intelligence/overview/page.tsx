"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { demoMoments } from "@/lib/trend/demo-data/moments";
import { demoOrganicAssets } from "@/lib/organic/demo-data/organic-assets";
import { demoOrganicMetrics } from "@/lib/organic/demo-data/organic-metrics";
import { MomentCard } from "@/components/cards/MomentCard";
import { AlignmentBadge } from "@/components/badges/AlignmentBadge";
import { findAlignedMoments } from "@/lib/trend/moment-analysis/alignment-detector";
import { generateTrendInsights } from "@/lib/trend/insight-engine/trend-insight-generator";
import { TrendInsightPanel } from "@/components/cards/TrendInsightPanel";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function TrendOverviewPage() {
  const [selectedAssetId, setSelectedAssetId] = useState<string>("");

  const selectedAsset = selectedAssetId
    ? demoOrganicAssets.find((a) => a.id === selectedAssetId)
    : null;

  const alignments = selectedAsset
    ? findAlignedMoments(selectedAsset, demoMoments)
    : [];

  const metrics = selectedAsset
    ? demoOrganicMetrics.filter((m) => m.assetId === selectedAssetId)
    : [];

  const insights = selectedAsset
    ? generateTrendInsights(selectedAsset, metrics, demoMoments)
    : [];

  const activeMoments = demoMoments.filter((moment) => {
    const now = new Date();
    const start = new Date(moment.startDate);
    const end = new Date(moment.endDate);
    return now >= start && now <= end;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Trend & Moment Intelligence</h1>
        <p className="text-muted-foreground mt-2">
          Analyze how timing and context influence organic content performance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Active Moments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {activeMoments.length > 0 ? (
              activeMoments.map((moment) => (
                <Link key={moment.id} href={`/trend-intelligence/moment-detail?id=${moment.id}`}>
                  <MomentCard moment={moment} />
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No active moments at this time.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>All Moments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {demoMoments.map((moment) => (
              <Link key={moment.id} href={`/trend-intelligence/moment-detail?id=${moment.id}`}>
                <MomentCard moment={moment} />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content × Moment Alignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Select Content</p>
              <div className="flex flex-wrap gap-2">
                {demoOrganicAssets.map((asset) => (
                  <Button
                    key={asset.id}
                    variant={selectedAssetId === asset.id ? "default" : "outline"}
                    onClick={() => setSelectedAssetId(asset.id)}
                  >
                    {asset.title || asset.id}
                  </Button>
                ))}
              </div>
            </div>

            {selectedAsset && (
              <>
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Alignment Results</h3>
                  {alignments.length > 0 ? (
                    <div className="space-y-4">
                      {alignments.map((alignment) => {
                        const moment = demoMoments.find((m) => m.id === alignment.momentId);
                        return (
                          <Card key={alignment.momentId}>
                            <CardContent className="pt-6">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h4 className="font-semibold">{moment?.topic}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {moment?.startDate} - {moment?.endDate}
                                  </p>
                                </div>
                                <AlignmentBadge strength={alignment.alignmentStrength} />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
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
                              {alignment.estimatedUplift && (
                                <div className="mt-4">
                                  <p className="text-xs text-muted-foreground">Estimated Uplift</p>
                                  <p className="text-lg font-semibold text-green-600">
                                    +{alignment.estimatedUplift.toFixed(0)}%
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No moment alignment detected for this content.
                    </p>
                  )}
                </div>

                {insights.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <TrendInsightPanel insights={insights} />
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* CTA to Market Context */}
      <div className="mt-8">
        <Card className="border-blue-200 bg-blue-50/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-2">Analyze Strategic Context</h3>
                <p className="text-sm text-muted-foreground">
                  View interpreted market signals that provide context for strategic thinking.
                </p>
              </div>
              <Link href="/dashboard/market-context">
                <Button>View Market Context</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

