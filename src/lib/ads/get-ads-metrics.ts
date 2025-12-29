import { AdsMetrics } from "@/types";
import { demoAdsMetrics } from "@/lib/demo-data/ads-metrics";

export function getAdsMetricsByAssetId(assetId: string): AdsMetrics[] {
  // Future: Replace with real Ads API integration
  return demoAdsMetrics.filter((metric) => metric.assetId === assetId);
}

export function getLatestAdsMetrics(assetId: string): AdsMetrics | undefined {
  const metrics = getAdsMetricsByAssetId(assetId);
  return metrics.length > 0 ? metrics[metrics.length - 1] : undefined;
}

export function calculateTotalSpend(assetId: string): number {
  const metrics = getAdsMetricsByAssetId(assetId);
  return metrics.reduce((sum, metric) => sum + metric.spend, 0);
}

export function calculateAverageROAS(assetId: string): number {
  const metrics = getAdsMetricsByAssetId(assetId);
  if (metrics.length === 0) return 0;
  const totalROAS = metrics.reduce((sum, metric) => sum + metric.roas, 0);
  return totalROAS / metrics.length;
}

