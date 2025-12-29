"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { demoOrganicAssets } from "@/lib/organic/demo-data/organic-assets";
import { demoOrganicMetrics } from "@/lib/organic/demo-data/organic-metrics";
import { MomentumBadge } from "@/components/badges/MomentumBadge";
import { PlatformFitIndicator } from "@/components/badges/PlatformFitIndicator";
import { generateMomentumState } from "@/lib/organic/momentum-intelligence/lifecycle-classifier";
import { OrganicPlatform } from "@/types/organic";

export default function OrganicOverviewPage() {
  const [platformFilter, setPlatformFilter] = useState<OrganicPlatform | "">("");

  const assetsWithMetrics = demoOrganicAssets.map((asset) => {
    const metrics = demoOrganicMetrics.filter((m) => m.assetId === asset.id);
    const momentumState = generateMomentumState(asset, metrics);
    const latest = metrics[metrics.length - 1] || {
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      engagementVelocity: 0,
      date: asset.publishDate,
    };

    return {
      asset,
      metrics: latest,
      momentumState,
    };
  });

  const filteredAssets = platformFilter
    ? assetsWithMetrics.filter((item) => item.asset.platform === platformFilter)
    : assetsWithMetrics;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Organic Content Overview</h1>
        <p className="text-muted-foreground mt-2">
          Analyze organic content performance across platforms
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={platformFilter === "" ? "default" : "outline"}
              onClick={() => setPlatformFilter("")}
            >
              All Platforms
            </Button>
            <Button
              variant={platformFilter === "YouTube" ? "default" : "outline"}
              onClick={() => setPlatformFilter("YouTube")}
            >
              YouTube
            </Button>
            <Button
              variant={platformFilter === "Meta" ? "default" : "outline"}
              onClick={() => setPlatformFilter("Meta")}
            >
              Meta
            </Button>
            <Button
              variant={platformFilter === "TikTok" ? "default" : "outline"}
              onClick={() => setPlatformFilter("TikTok")}
            >
              TikTok
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredAssets.map(({ asset, metrics, momentumState }) => (
          <Card key={asset.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{asset.title || asset.id}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{asset.platform}</Badge>
                    <Badge variant="outline">{asset.format}</Badge>
                    {asset.duration && (
                      <Badge variant="outline">{asset.duration}s</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MomentumBadge momentumType={momentumState.momentumType} />
                  <PlatformFitIndicator platformFit={momentumState.platformFit} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Views</p>
                  <p className="text-2xl font-bold">{metrics.views.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Likes</p>
                  <p className="text-2xl font-bold">{metrics.likes.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Comments</p>
                  <p className="text-2xl font-bold">{metrics.comments.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Shares</p>
                  <p className="text-2xl font-bold">{metrics.shares.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Engagement Velocity</p>
                <p className="text-xl font-semibold">{metrics.engagementVelocity.toFixed(1)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

