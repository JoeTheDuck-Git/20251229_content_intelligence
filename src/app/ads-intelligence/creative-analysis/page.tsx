"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { demoAdsAssets } from "@/lib/demo-data/ads-assets";
import { demoAdsPerformanceMetrics } from "@/lib/demo-data/ads-performance-metrics";
import { generateCreativeIntelligence } from "@/lib/insight-engine/insight-generator";
import { PerformanceMetricCard } from "@/components/cards/PerformanceMetricCard";
import { IntelligenceBadge } from "@/components/badges/IntelligenceBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdsCreativeAsset, AdsPerformanceMetrics } from "@/types/ads";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils";
import { getLatestMetrics, getMetricsByAssetId } from "@/lib/ads-intelligence/get-metrics";

export default function CreativeAnalysisPage() {
  const searchParams = useSearchParams();
  const assetId = searchParams.get("assetId") || "";
  const [asset, setAsset] = useState<AdsCreativeAsset | undefined>();
  const [metrics, setMetrics] = useState<AdsPerformanceMetrics[]>([]);
  const [intelligence, setIntelligence] = useState<any>();

  useEffect(() => {
    if (assetId) {
      const assetData = demoAdsAssets.find((a) => a.id === assetId);
      setAsset(assetData);
      const metricsData = getMetricsByAssetId(assetId);
      setMetrics(metricsData);
      if (assetData) {
        const intel = generateCreativeIntelligence(assetData, metricsData);
        setIntelligence(intel);
      }
    }
  }, [assetId]);

  if (!asset || !intelligence) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please select a creative to analyze</p>
      </div>
    );
  }

  const latest = getLatestMetrics(assetId);
  if (!latest) return null;

  const totalSpend = metrics.reduce((sum, m) => sum + m.spend, 0);
  const avgROAS = metrics.reduce((sum, m) => sum + m.roas, 0) / metrics.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Creative Intelligence Analysis</h1>
        <p className="text-muted-foreground mt-2">
          {asset.platform} - {asset.duration}s
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <PerformanceMetricCard
          title="Total Spend"
          value={formatCurrency(totalSpend)}
        />
        <PerformanceMetricCard
          title="Latest CTR"
          value={formatPercentage(latest.ctr)}
        />
        <PerformanceMetricCard
          title="Average ROAS"
          value={`${avgROAS.toFixed(1)}x`}
        />
        <PerformanceMetricCard
          title="Frequency"
          value={latest.frequency.toFixed(1)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Intelligence Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Fatigue Status</p>
              <IntelligenceBadge type="fatigue" value={intelligence.fatigueStatus} />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Scale Potential</p>
              <IntelligenceBadge type="scale" value={intelligence.scalePotential} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Creative Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
            <div>
              <p className="text-sm font-medium mb-2">Visual Density</p>
              <Badge variant="outline">{asset.creativeFeatures.visualDensity}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {intelligence.keyDrivers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {intelligence.keyDrivers.map((driver: string, idx: number) => (
                <li key={idx} className="text-sm flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  {driver}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {intelligence.riskSignals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Risk Signals</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {intelligence.riskSignals.map((signal: string, idx: number) => (
                <li key={idx} className="text-sm flex items-center gap-2">
                  <span className="text-red-500">⚠</span>
                  {signal}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

