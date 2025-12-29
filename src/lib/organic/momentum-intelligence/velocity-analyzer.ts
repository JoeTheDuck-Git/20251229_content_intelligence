import { OrganicPerformanceMetrics } from "@/types/organic";

export interface VelocityAnalysis {
  averageVelocity: number;
  velocityTrend: "accelerating" | "stable" | "decelerating";
  peakVelocity: number;
  velocityConsistency: number;
}

export function analyzeVelocity(
  metrics: OrganicPerformanceMetrics[]
): VelocityAnalysis {
  if (metrics.length === 0) {
    return {
      averageVelocity: 0,
      velocityTrend: "stable",
      peakVelocity: 0,
      velocityConsistency: 0,
    };
  }

  const velocities = metrics.map((m) => m.engagementVelocity);
  const averageVelocity =
    velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
  const peakVelocity = Math.max(...velocities);

  // Calculate trend
  if (metrics.length < 2) {
    return {
      averageVelocity,
      velocityTrend: "stable",
      peakVelocity,
      velocityConsistency: 1,
    };
  }

  const recent = metrics.slice(-3);
  const early = metrics.slice(0, Math.min(3, metrics.length - recent.length));

  const recentAvg =
    recent.reduce((sum, m) => sum + m.engagementVelocity, 0) / recent.length;
  const earlyAvg =
    early.reduce((sum, m) => sum + m.engagementVelocity, 0) / early.length;

  let velocityTrend: "accelerating" | "stable" | "decelerating";
  if (recentAvg > earlyAvg * 1.1) {
    velocityTrend = "accelerating";
  } else if (recentAvg < earlyAvg * 0.9) {
    velocityTrend = "decelerating";
  } else {
    velocityTrend = "stable";
  }

  // Calculate consistency (lower std dev = higher consistency)
  const variance =
    velocities.reduce((sum, v) => sum + Math.pow(v - averageVelocity, 2), 0) /
    velocities.length;
  const stdDev = Math.sqrt(variance);
  const velocityConsistency = Math.max(0, 1 - stdDev / averageVelocity);

  return {
    averageVelocity,
    velocityTrend,
    peakVelocity,
    velocityConsistency,
  };
}

export function calculateEngagementRate(
  metrics: OrganicPerformanceMetrics
): number {
  const totalEngagements =
    metrics.likes + metrics.comments + metrics.shares;
  return metrics.views > 0 ? (totalEngagements / metrics.views) * 100 : 0;
}

