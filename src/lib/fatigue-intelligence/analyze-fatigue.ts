import { FatigueAnalysis, AdsMetric } from "@/types/fatigue";
import { detectAllFatigueSignals } from "./fatigue-signals";
import {
  classifyFatigueStatus,
  determineRecommendedAction,
  calculateConfidence,
} from "./fatigue-classifier";
import { generateFatigueExplanation } from "./fatigue-explainer";

export function analyzeFatigue(assetId: string, metrics: AdsMetric[]): FatigueAnalysis {
  const signals = detectAllFatigueSignals(metrics);
  const status = classifyFatigueStatus(signals, metrics);
  const explanation = generateFatigueExplanation(status, signals, metrics);
  const recommendedAction = determineRecommendedAction(status, metrics);
  const confidence = calculateConfidence(signals, metrics);

  const latest = metrics[metrics.length - 1];
  const previous = metrics.length >= 2 ? metrics[metrics.length - 2] : latest;

  // Calculate trends
  const frequencyTrend =
    latest.frequency > previous.frequency * 1.05
      ? "increasing"
      : latest.frequency < previous.frequency * 0.95
      ? "decreasing"
      : "stable";

  const ctrTrend =
    latest.ctr > previous.ctr * 1.02
      ? "improving"
      : latest.ctr < previous.ctr * 0.98
      ? "declining"
      : "stable";

  const roasTrend =
    latest.roas > previous.roas * 1.02
      ? "improving"
      : latest.roas < previous.roas * 0.98
      ? "declining"
      : "stable";

  const totalSpend = metrics.reduce((sum, m) => sum + m.spend, 0);

  return {
    assetId,
    status,
    signals,
    explanation,
    confidence,
    recommendedAction,
    metrics: {
      currentFrequency: latest.frequency,
      frequencyTrend,
      currentCTR: latest.ctr,
      ctrTrend,
      currentROAS: latest.roas,
      roasTrend,
      totalSpend,
    },
  };
}

