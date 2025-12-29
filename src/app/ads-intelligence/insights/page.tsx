"use client";

import { useState } from "react";
import { demoAdsAssets } from "@/lib/demo-data/ads-assets";
import {
  generateCreativeIntelligence,
  generateInsights,
  generateRecommendations,
} from "@/lib/insight-engine/insight-generator";
import { InsightCard } from "@/components/cards/InsightCard";
import { RecommendationPanel } from "@/components/cards/RecommendationPanel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMetricsByAssetId } from "@/lib/ads-intelligence/get-metrics";

export default function InsightsPage() {
  const [selectedAssetId, setSelectedAssetId] = useState<string>(
    demoAdsAssets[0]?.id || ""
  );

  const selectedAsset = demoAdsAssets.find((a) => a.id === selectedAssetId);
  const metrics = selectedAsset
    ? getMetricsByAssetId(selectedAssetId)
    : [];

  const intelligence = selectedAsset
    ? generateCreativeIntelligence(selectedAsset, metrics)
    : null;

  const insights = selectedAsset && intelligence
    ? generateInsights(selectedAsset, metrics, intelligence)
    : [];

  const recommendations = selectedAsset && intelligence
    ? generateRecommendations(selectedAsset, metrics, intelligence)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Insights & Recommendations</h1>
        <p className="text-muted-foreground mt-2">
          AI-powered intelligence for your ad creatives
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Creative</CardTitle>
          <CardDescription>
            Choose a creative to view detailed insights and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {demoAdsAssets.map((asset) => (
              <Button
                key={asset.id}
                variant={selectedAssetId === asset.id ? "default" : "outline"}
                onClick={() => setSelectedAssetId(asset.id)}
              >
                {asset.platform} - {asset.duration}s
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {recommendations.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
          <RecommendationPanel recommendations={recommendations} />
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Insights</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Future: AI Model Plug-in - Currently using rule-based logic
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
          {insights.length === 0 && (
            <p className="text-muted-foreground">No insights available for this creative.</p>
          )}
        </div>
      </div>
    </div>
  );
}

