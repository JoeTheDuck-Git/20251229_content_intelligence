"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { demoOrganicAssets } from "@/lib/organic/demo-data/organic-assets";
import { demoOrganicMetrics } from "@/lib/organic/demo-data/organic-metrics";
import { CreativeSignalCard } from "@/components/cards/CreativeSignalCard";
import { MomentumBadge } from "@/components/badges/MomentumBadge";
import { PlatformFitIndicator } from "@/components/badges/PlatformFitIndicator";
import { generateMomentumState } from "@/lib/organic/momentum-intelligence/lifecycle-classifier";
import { analyzeVelocity } from "@/lib/organic/momentum-intelligence/velocity-analyzer";
import { TrendChart } from "@/components/charts/TrendChart";

export default function ContentAnalysisPage() {
  const [selectedAssetId, setSelectedAssetId] = useState<string>(
    demoOrganicAssets[0]?.id || ""
  );

  const selectedAsset = demoOrganicAssets.find((a) => a.id === selectedAssetId);
  const metrics = selectedAsset
    ? demoOrganicMetrics.filter((m) => m.assetId === selectedAssetId)
    : [];
  const momentumState = selectedAsset
    ? generateMomentumState(selectedAsset, metrics)
    : null;
  const velocityAnalysis = analyzeVelocity(metrics);

  const chartData = metrics.map((m) => ({
    date: m.date,
    value: m.engagementVelocity,
    label: "Engagement Velocity",
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Deep dive into creative signals and momentum patterns
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Content</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {selectedAsset && momentumState && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CreativeSignalCard asset={selectedAsset} />
            <Card>
              <CardHeader>
                <CardTitle>Momentum Classification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Momentum Type</p>
                  <MomentumBadge momentumType={momentumState.momentumType} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Platform Fit</p>
                  <PlatformFitIndicator platformFit={momentumState.platformFit} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Velocity Score</p>
                  <p className="text-2xl font-bold">{momentumState.velocityScore.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Resonance Score</p>
                  <p className="text-2xl font-bold">{momentumState.resonanceScore.toFixed(1)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Engagement Velocity Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Velocity</p>
                    <p className="text-xl font-bold">{velocityAnalysis.averageVelocity.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Peak Velocity</p>
                    <p className="text-xl font-bold">{velocityAnalysis.peakVelocity.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trend</p>
                    <p className="text-xl font-bold capitalize">{velocityAnalysis.velocityTrend}</p>
                  </div>
                </div>
                {chartData.length > 0 && (
                  <TrendChart data={chartData} />
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

