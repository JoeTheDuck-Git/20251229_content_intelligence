import { AdsPerformanceMetrics, FatigueStatus } from "@/types/ads";

export function detectFatigue(metrics: AdsPerformanceMetrics[]): FatigueStatus {
  if (metrics.length < 2) return "healthy";

  const recent = metrics.slice(-3);
  const latest = recent[recent.length - 1];

  // Rule: Frequency ↑ + ROAS ↓ → fatigue warning
  if (recent.length >= 2) {
    const roasTrend = recent.map((m) => m.roas);
    const frequencyTrend = recent.map((m) => m.frequency);

    const roasDeclining = roasTrend[0] > roasTrend[roasTrend.length - 1];
    const frequencyIncreasing =
      frequencyTrend[frequencyTrend.length - 1] > frequencyTrend[0];

    if (roasDeclining && frequencyIncreasing) {
      if (latest.frequency > 4 && latest.roas < 3) {
        return "fatigued";
      }
      return "warning";
    }
  }

  // Rule: CTR decay across time buckets → fatigue
  if (recent.length >= 3) {
    const ctrTrend = recent.map((m) => m.ctr);
    const isDeclining = ctrTrend.every(
      (val, idx) => idx === 0 || val <= ctrTrend[idx - 1]
    );

    if (isDeclining && latest.ctr < recent[0].ctr * 0.8) {
      return latest.frequency > 3 ? "fatigued" : "warning";
    }
  }

  return "healthy";
}

export function assessScalePotential(
  metrics: AdsPerformanceMetrics[]
): "low" | "medium" | "high" {
  if (metrics.length < 2) return "medium";

  const recent = metrics.slice(-2);
  const latest = recent[recent.length - 1];

  // Rule: Stable ROAS + increasing spend → scalable
  const roasStable =
    Math.abs(recent[0].roas - latest.roas) / recent[0].roas < 0.1;
  const spendIncreasing = latest.spend > recent[0].spend;

  if (roasStable && spendIncreasing && latest.roas > 4) {
    return "high";
  }

  if (latest.roas > 4 && latest.frequency < 2) {
    return "high";
  }

  if (latest.roas < 3 || latest.frequency > 4) {
    return "low";
  }

  return "medium";
}

export function identifyRiskSignals(
  metrics: AdsPerformanceMetrics[]
): string[] {
  const signals: string[] = [];
  const latest = metrics[metrics.length - 1];

  if (latest.frequency > 4) {
    signals.push("High frequency indicates audience saturation");
  }

  if (latest.ctr > 5 && latest.roas < 3) {
    signals.push("Conversion mismatch: high CTR but low ROAS");
  }

  if (metrics.length >= 3) {
    const roasTrend = metrics.slice(-3).map((m) => m.roas);
    const isDeclining = roasTrend[0] > roasTrend[roasTrend.length - 1];
    if (isDeclining) {
      signals.push("ROAS declining trend detected");
    }
  }

  return signals;
}

