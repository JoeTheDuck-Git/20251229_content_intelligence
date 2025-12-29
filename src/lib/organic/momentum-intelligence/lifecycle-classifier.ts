import {
  OrganicPerformanceMetrics,
  MomentumType,
  OrganicMomentumState,
} from "@/types/organic";
import { analyzeVelocity, VelocityAnalysis } from "./velocity-analyzer";

export function classifyMomentum(
  metrics: OrganicPerformanceMetrics[]
): MomentumType {
  if (metrics.length === 0) return "decaying";

  const velocityAnalysis = analyzeVelocity(metrics);
  const latest = metrics[metrics.length - 1];
  const early = metrics[0];

  // Calculate growth rate
  const viewsGrowth = latest.views / early.views;
  const engagementGrowth =
    (latest.likes + latest.comments + latest.shares) /
    (early.likes + early.comments + early.shares);

  // Viral candidate: accelerating velocity + high engagement growth
  if (
    velocityAnalysis.velocityTrend === "accelerating" &&
    velocityAnalysis.averageVelocity > 8 &&
    engagementGrowth > 5
  ) {
    return "viral_candidate";
  }

  // Organic spike: high early velocity but declining
  if (
    velocityAnalysis.peakVelocity > 7 &&
    velocityAnalysis.velocityTrend === "decelerating" &&
    viewsGrowth > 3 &&
    viewsGrowth < 10
  ) {
    return "organic_spike";
  }

  // Steady growth: consistent velocity, moderate growth
  if (
    velocityAnalysis.velocityConsistency > 0.6 &&
    velocityAnalysis.averageVelocity > 4 &&
    viewsGrowth > 1.5 &&
    viewsGrowth < 5
  ) {
    return "steady_growth";
  }

  // Decaying: declining velocity or low engagement
  return "decaying";
}

export function assessPlatformFit(
  asset: { platform: string; creativeSignals: any },
  metrics: OrganicPerformanceMetrics[]
): "low" | "medium" | "high" {
  const velocityAnalysis = analyzeVelocity(metrics);
  const latest = metrics[metrics.length - 1];

  // Calculate engagement rate
  const engagementRate =
    ((latest.likes + latest.comments + latest.shares) / latest.views) * 100;

  let fitScore = 0;

  // Platform-specific signals
  if (asset.platform === "TikTok") {
    if (asset.creativeSignals.pacing === "fast") fitScore += 2;
    if (asset.creativeSignals.visualFocus === "person") fitScore += 2;
    if (velocityAnalysis.averageVelocity > 7) fitScore += 1;
  } else if (asset.platform === "YouTube") {
    if (asset.creativeSignals.pacing === "slow" || asset.creativeSignals.pacing === "medium") fitScore += 2;
    if (asset.creativeSignals.emotionalTone === "informative") fitScore += 2;
    if (latest.watchTime && latest.watchTime > 0) fitScore += 1;
  } else if (asset.platform === "Meta") {
    if (asset.creativeSignals.visualFocus === "product" || asset.creativeSignals.visualFocus === "scene") fitScore += 2;
    if (asset.creativeSignals.emotionalTone === "inspiring") fitScore += 2;
    if (engagementRate > 5) fitScore += 1;
  }

  if (fitScore >= 4) return "high";
  if (fitScore >= 2) return "medium";
  return "low";
}

export function generateMomentumState(
  asset: { id: string; platform: string; creativeSignals: any },
  metrics: OrganicPerformanceMetrics[]
): OrganicMomentumState {
  const momentumType = classifyMomentum(metrics);
  const platformFit = assessPlatformFit(asset, metrics);
  const velocityAnalysis = analyzeVelocity(metrics);
  const latest = metrics[metrics.length - 1];

  // Calculate resonance score (engagement quality)
  const totalEngagements = latest.likes + latest.comments + latest.shares;
  const resonanceScore = Math.min(10, (totalEngagements / latest.views) * 100 * 2);

  return {
    assetId: asset.id,
    momentumType,
    platformFit,
    velocityScore: Math.min(10, velocityAnalysis.averageVelocity),
    resonanceScore,
  };
}

