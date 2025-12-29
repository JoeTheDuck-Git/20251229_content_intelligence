"use client";

import { useState } from "react";
import { getContentAssets } from "@/lib/content/get-content-assets";
import { generateInsights, generateRecommendations, getGlobalInsights } from "@/lib/insights/generate-insights";
import { InsightCard } from "@/components/cards/InsightCard";
import { RecommendationBlock } from "@/components/cards/RecommendationBlock";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MeasurementInsightsPage() {
  const assets = getContentAssets();
  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || "");
  const selectedAsset = assets.find((a) => a.id === selectedAssetId);

  const assetInsights = selectedAssetId ? generateInsights(selectedAssetId) : [];
  const globalInsights = getGlobalInsights();
  const recommendation = selectedAsset
    ? generateRecommendations(selectedAssetId, selectedAsset)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Measurement & AI Insights</h1>
        <p className="text-muted-foreground mt-2">
          AI-powered insights and recommendations for your content performance
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Asset for Analysis</CardTitle>
          <CardDescription>
            Choose a content asset to view detailed insights and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {assets.map((asset) => (
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

      {recommendation && (
        <RecommendationBlock recommendation={recommendation} />
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Asset-Specific Insights</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {assetInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
          {assetInsights.length === 0 && (
            <p className="text-muted-foreground">No specific insights available for this asset.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Global Insights</h2>
        <p className="text-sm text-muted-foreground mb-4">
          AI Model Plug-in (Future) - Currently using rule-based logic
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {globalInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>
    </div>
  );
}

