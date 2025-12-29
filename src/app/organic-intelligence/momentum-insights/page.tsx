"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { demoOrganicAssets } from "@/lib/organic/demo-data/organic-assets";
import { demoOrganicMetrics } from "@/lib/organic/demo-data/organic-metrics";
import { OrganicInsightPanel } from "@/components/cards/OrganicInsightPanel";
import { generateMomentumState } from "@/lib/organic/momentum-intelligence/lifecycle-classifier";
import {
  generateOrganicInsights,
  generatePlatformRecommendations,
} from "@/lib/organic/insight-engine/organic-insight-generator";
import { Badge } from "@/components/ui/badge";

export default function MomentumInsightsPage() {
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
  const insights = selectedAsset && momentumState
    ? generateOrganicInsights(selectedAsset, metrics, momentumState)
    : [];
  const recommendations = selectedAsset && momentumState
    ? generatePlatformRecommendations(selectedAsset, momentumState)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Momentum Insights</h1>
        <p className="text-muted-foreground mt-2">
          Understand why content gains organic traction
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OrganicInsightPanel insights={insights} />
          <Card>
            <CardHeader>
              <CardTitle>Platform Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{rec.platform}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{rec.reasoning}</p>
                  <ul className="list-disc list-inside space-y-1">
                    {rec.creativeGuidance.map((guidance, gIdx) => (
                      <li key={gIdx} className="text-sm">{guidance}</li>
                    ))}
                  </ul>
                </div>
              ))}
              {recommendations.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No specific recommendations available. Content shows mixed signals.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

