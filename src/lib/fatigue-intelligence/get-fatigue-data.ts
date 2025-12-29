import { AdsMetric } from "@/types/fatigue";
import { demoFatigueMetrics } from "@/lib/demo-data/fatigue-metrics";

export function getMetricsByAssetId(assetId: string): AdsMetric[] {
  return demoFatigueMetrics
    .filter((m) => m.assetId === assetId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getAllAssetIds(): string[] {
  return Array.from(new Set(demoFatigueMetrics.map((m) => m.assetId)));
}

export function getLatestMetric(assetId: string): AdsMetric | undefined {
  const metrics = getMetricsByAssetId(assetId);
  return metrics.length > 0 ? metrics[metrics.length - 1] : undefined;
}

