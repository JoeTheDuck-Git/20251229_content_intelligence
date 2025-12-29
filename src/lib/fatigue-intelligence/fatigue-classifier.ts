import { AdsMetric, FatigueStatus, FatigueSignal } from "@/types/fatigue";

export function classifyFatigueStatus(
  signals: FatigueSignal[],
  metrics: AdsMetric[]
): FatigueStatus {
  const detectedSignals = signals.filter((s) => s.detected);
  const highSeverityCount = detectedSignals.filter(
    (s) => s.severity === "high"
  ).length;
  const mediumSeverityCount = detectedSignals.filter(
    (s) => s.severity === "medium"
  ).length;

  // Fatigued: Multiple high severity signals or combination of signals
  if (highSeverityCount >= 2) {
    return "fatigued";
  }

  if (highSeverityCount >= 1 && mediumSeverityCount >= 1) {
    return "fatigued";
  }

  // Early warning: Medium severity signals detected
  if (mediumSeverityCount >= 2 || highSeverityCount >= 1) {
    return "early_warning";
  }

  // Healthy: No significant signals or only low severity
  return "healthy";
}

export function determineRecommendedAction(
  status: FatigueStatus,
  metrics: AdsMetric[]
): "continue" | "refresh_creative" | "pause_scaling" {
  if (status === "fatigued") {
    return "refresh_creative";
  }

  if (status === "early_warning") {
    return "pause_scaling";
  }

  return "continue";
}

export function calculateConfidence(
  signals: FatigueSignal[],
  metrics: AdsMetric[]
): "high" | "medium" | "low" {
  const detectedSignals = signals.filter((s) => s.detected);
  const dataPoints = metrics.length;

  if (dataPoints >= 4 && detectedSignals.length >= 2) {
    return "high";
  }

  if (dataPoints >= 3 && detectedSignals.length >= 1) {
    return "medium";
  }

  return "low";
}

