"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getContentAssetById } from "@/lib/content/get-content-assets";
import { getAdsMetricsByAssetId, calculateTotalSpend, calculateAverageROAS } from "@/lib/ads/get-ads-metrics";
import { getMeasurementByAssetId } from "@/lib/measurement/get-measurement";
import { ContentAsset } from "@/types";
import { MetricCard } from "@/components/cards/MetricCard";
import { TrendChart } from "@/components/charts/TrendChart";
import { CreativeFeatureBadge } from "@/components/badges/CreativeFeatureBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export default function ContentAdsPerformancePage() {
  const searchParams = useSearchParams();
  const assetId = searchParams.get("assetId") || "";
  const [asset, setAsset] = useState<ContentAsset | undefined>();
  const [metrics, setMetrics] = useState<any[]>([]);
  const [measurement, setMeasurement] = useState<any>();

  useEffect(() => {
    if (assetId) {
      const assetData = getContentAssetById(assetId);
      setAsset(assetData);
      const metricsData = getAdsMetricsByAssetId(assetId);
      setMetrics(metricsData);
      const measurementData = getMeasurementByAssetId(assetId);
      setMeasurement(measurementData);
    }
  }, [assetId]);

  if (!asset) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please select a content asset to view performance</p>
      </div>
    );
  }

  const totalSpend = calculateTotalSpend(assetId);
  const avgROAS = calculateAverageROAS(assetId);
  const latestMetrics = metrics[metrics.length - 1];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content × Ads Performance</h1>
        <p className="text-muted-foreground mt-2">
          Analyzing performance for {asset.platform} video ({asset.duration}s)
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Total Ad Spend"
          value={formatCurrency(totalSpend)}
        />
        <MetricCard
          title="Latest CTR"
          value={formatPercentage(latestMetrics?.ctr || 0)}
        />
        <MetricCard
          title="Average ROAS"
          value={`${avgROAS.toFixed(2)}x`}
        />
        <MetricCard
          title="Total Impressions"
          value={formatNumber(metrics.reduce((sum, m) => sum + m.impressions, 0))}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TrendChart data={metrics} metric="roas" />
        <TrendChart data={metrics} metric="ctr" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Creative Feature Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Hook Type</p>
            <Badge variant="outline">{asset.creativeFeatures.hookType}</Badge>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Pacing</p>
            <Badge variant="outline">{asset.creativeFeatures.pacing}</Badge>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Voice Type</p>
            <Badge variant="outline">{asset.creativeFeatures.voiceType}</Badge>
          </div>
          {measurement?.creativeFatigue && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Creative Fatigue Detected - Performance declining over multiple cycles
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

