import { AdsPerformanceMetrics } from "@/types/ads";
import { demoAdsPerformanceMetrics } from "@/lib/demo-data/ads-performance-metrics";

export function getMetricsByAssetId(assetId: string): AdsPerformanceMetrics[] {
  // Future: Replace with real Ads API integration
  return demoAdsPerformanceMetrics.filter((m) => m.assetId === assetId);
}

export function getLatestMetrics(assetId: string): AdsPerformanceMetrics | undefined {
  const metrics = getMetricsByAssetId(assetId);
  return metrics.length > 0 ? metrics[metrics.length - 1] : undefined;
}

