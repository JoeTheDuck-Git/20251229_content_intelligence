import { FatigueStatus, FatigueSignal, AdsMetric } from "@/types/fatigue";

export function generateFatigueExplanation(
  status: FatigueStatus,
  signals: FatigueSignal[],
  metrics: AdsMetric[]
): string {
  const detectedSignals = signals.filter((s) => s.detected);
  const latest = metrics[metrics.length - 1];

  if (status === "healthy") {
    if (metrics.length >= 2) {
      const previous = metrics[metrics.length - 2];
      if (
        latest.ctr >= previous.ctr &&
        latest.roas >= previous.roas * 0.95 &&
        latest.frequency < 3
      ) {
        return "Creative remains stable under increased spend. Performance metrics are consistent, indicating the creative is still effective.";
      }
    }
    return "Creative shows no signs of fatigue. All key metrics are within healthy ranges.";
  }

  if (status === "early_warning") {
    const primarySignal = detectedSignals.find((s) => s.severity === "high") ||
      detectedSignals[0];

    if (primarySignal?.type === "frequency_saturation") {
      return `Early warning: Frequency saturation detected. Performance decline is likely caused by frequency saturation (${latest.frequency.toFixed(1)}x). Consider reducing frequency or refreshing the creative.`;
    }

    if (primarySignal?.type === "ctr_decay") {
      return `Early warning: CTR decay detected after repeated exposure. The creative is losing effectiveness as the same audience sees it multiple times.`;
    }

    if (primarySignal?.type === "roas_decline") {
      return `Early warning: ROAS decline detected. Performance is decreasing as spend increases, suggesting the creative may be reaching its optimal scale.`;
    }

    return "Early warning: Some performance signals indicate potential fatigue. Monitor closely and prepare refresh variations.";
  }

  if (status === "fatigued") {
    const highSeveritySignals = detectedSignals.filter(
      (s) => s.severity === "high"
    );

    if (highSeveritySignals.length >= 2) {
      const signalTypes = highSeveritySignals.map((s) => s.type).join(" and ");
      return `Creative fatigue confirmed. Multiple signals detected: ${signalTypes}. Performance decline is significant and consistent. Immediate refresh recommended.`;
    }

    const freqSignal = detectedSignals.find(
      (s) => s.type === "frequency_saturation"
    );
    if (freqSignal?.detected && latest.frequency > 4) {
      return `Creative fatigue confirmed. Performance decline is likely caused by frequency saturation (${latest.frequency.toFixed(1)}x). The same audience has seen this creative too many times, leading to decreased engagement and conversions.`;
    }

    const ctrSignal = detectedSignals.find((s) => s.type === "ctr_decay");
    if (ctrSignal?.detected) {
      return `Creative fatigue confirmed. CTR decay detected after repeated exposure. The creative has lost its ability to capture attention effectively.`;
    }

    const roasSignal = detectedSignals.find((s) => s.type === "roas_decline");
    if (roasSignal?.detected) {
      return `Creative fatigue confirmed. ROAS decline after spend growth indicates the creative is no longer scaling efficiently.`;
    }

    return "Creative fatigue confirmed. Multiple performance indicators show significant decline. Refresh the creative immediately.";
  }

  return "Unable to generate explanation with current data.";
}

