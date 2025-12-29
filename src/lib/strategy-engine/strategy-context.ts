import { StrategyContext, FatigueSummary, PatternType, ScaleReliability, Platform, FatigueStatus } from "@/types/strategy";
import { CreativeCluster } from "@/types/clustering";
import { analyzeCluster } from "@/lib/creative-clustering/cluster-analyzer";
import { demoAdsAssets } from "@/lib/demo-data/ads-assets";
import { generateCreativeSignature } from "@/lib/creative-clustering/creative-signature";
import { analyzeFatigue } from "@/lib/fatigue-intelligence/analyze-fatigue";
import { getMetricsByAssetId } from "@/lib/fatigue-intelligence/get-fatigue-data";

function determinePatternType(
  fatigueSummary: FatigueSummary,
  assets: Array<{ platform: Platform }>
): PatternType {
  const platforms = Object.keys(fatigueSummary) as Platform[];
  
  if (platforms.length === 0) {
    return "platform_specific";
  }

  // Check if all platforms have same fatigue status
  const statuses = platforms.map((p) => fatigueSummary[p]);
  const allSame = statuses.every((s) => s === statuses[0]);

  if (allSame && statuses[0] === "healthy") {
    return "cross_platform_stable";
  }

  // Check if fatigue varies significantly by platform
  const hasFatigued = statuses.some((s) => s === "fatigued");
  const hasHealthy = statuses.some((s) => s === "healthy");

  if (hasFatigued && hasHealthy) {
    return "platform_sensitive";
  }

  return "platform_specific";
}

export function buildStrategyContext(cluster: CreativeCluster): StrategyContext {
  // Get assets in cluster
  const assets = demoAdsAssets.filter((asset) =>
    cluster.assetIds.includes(asset.id)
  );

  // Build fatigue summary by platform
  const fatigueSummary: FatigueSummary = {};
  const platformMetrics: StrategyContext["platformMetrics"] = {};

  const platformFatigueMap: Record<Platform, FatigueStatus[]> = {
    Meta: [],
    TikTok: [],
    YouTube: [],
  };

  assets.forEach((asset) => {
    const platform = asset.platform;
    const metrics = getMetricsByAssetId(asset.id);
    
    if (metrics.length > 0) {
      const analysis = analyzeFatigue(asset.id, metrics);
      const status: FatigueStatus = 
        analysis.status === "fatigued" ? "fatigued" :
        analysis.status === "early_warning" ? "warning" : "healthy";
      
      platformFatigueMap[platform].push(status);

      // Collect platform metrics
      if (!platformMetrics[platform]) {
        platformMetrics[platform] = {
          avgCTR: 0,
          avgROAS: 0,
          avgFrequency: 0,
        };
      }

      const latest = metrics[metrics.length - 1];
      const currentMetrics = platformMetrics[platform]!;
      currentMetrics.avgCTR += latest.ctr;
      currentMetrics.avgROAS += latest.roas;
      currentMetrics.avgFrequency += latest.frequency;
    }
  });

  // Calculate average metrics per platform
  Object.keys(platformMetrics).forEach((platform) => {
    const p = platform as Platform;
    const count = assets.filter((a) => a.platform === p).length;
    if (count > 0 && platformMetrics[p]) {
      platformMetrics[p]!.avgCTR /= count;
      platformMetrics[p]!.avgROAS /= count;
      platformMetrics[p]!.avgFrequency /= count;
    }
  });

  // Determine fatigue status per platform (most common status)
  Object.keys(platformFatigueMap).forEach((platform) => {
    const p = platform as Platform;
    const statuses = platformFatigueMap[p];
    if (statuses.length > 0) {
      const healthyCount = statuses.filter((s) => s === "healthy").length;
      const warningCount = statuses.filter((s) => s === "warning").length;
      const fatiguedCount = statuses.filter((s) => s === "fatigued").length;

      if (fatiguedCount >= warningCount && fatiguedCount >= healthyCount) {
        fatigueSummary[p] = "fatigued";
      } else if (warningCount >= healthyCount) {
        fatigueSummary[p] = "warning";
      } else {
        fatigueSummary[p] = "healthy";
      }
    }
  });

  // Determine pattern type
  const patternType = determinePatternType(fatigueSummary, assets);

  return {
    clusterId: cluster.clusterId,
    patternType,
    fatigueSummary,
    scaleReliability: cluster.scaleReliability,
    platformMetrics,
  };
}

