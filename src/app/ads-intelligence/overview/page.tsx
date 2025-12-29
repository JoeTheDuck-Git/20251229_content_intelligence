"use client";

import { useState } from "react";
import { demoAdsAssets } from "@/lib/demo-data/ads-assets";
import { demoAdsPerformanceMetrics } from "@/lib/demo-data/ads-performance-metrics";
import { generateCreativeIntelligence } from "@/lib/insight-engine/insight-generator";
import { CreativeCard } from "@/components/cards/CreativeCard";
import { getLatestMetrics } from "@/lib/ads-intelligence/get-metrics";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdsOverviewPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");

  const filteredAssets = selectedPlatform === "all"
    ? demoAdsAssets
    : demoAdsAssets.filter((asset) => asset.platform === selectedPlatform);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ads Creative Overview</h1>
        <p className="text-muted-foreground mt-2">
          Monitor and analyze your paid video ad creatives
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant={selectedPlatform === "all" ? "default" : "outline"}
          onClick={() => setSelectedPlatform("all")}
        >
          All Platforms
        </Button>
        <Button
          variant={selectedPlatform === "Meta" ? "default" : "outline"}
          onClick={() => setSelectedPlatform("Meta")}
        >
          Meta
        </Button>
        <Button
          variant={selectedPlatform === "YouTube" ? "default" : "outline"}
          onClick={() => setSelectedPlatform("YouTube")}
        >
          YouTube
        </Button>
        <Button
          variant={selectedPlatform === "TikTok" ? "default" : "outline"}
          onClick={() => setSelectedPlatform("TikTok")}
        >
          TikTok
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAssets.map((asset) => {
          const metrics = demoAdsPerformanceMetrics.filter(
            (m) => m.assetId === asset.id
          );
          const latest = getLatestMetrics(asset.id);
          const intelligence = generateCreativeIntelligence(asset, metrics);

          if (!latest) return null;

          return (
            <Link key={asset.id} href={`/ads-intelligence/creative-analysis?assetId=${asset.id}`}>
              <CreativeCard
                asset={asset}
                ctr={latest.ctr}
                roas={latest.roas}
                spend={latest.spend}
                fatigueStatus={intelligence.fatigueStatus}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

