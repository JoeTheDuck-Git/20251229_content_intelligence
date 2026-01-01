import { TrendSignal, PresenceChange } from "@/types/trend";
import { ContentAsset } from "@/types";
import { TimePerspective } from "@/types/creative-performance";
import {
  evaluateConfidenceDimensions,
  calculateTrendSignalConfidence,
} from "./confidence-scorer";

/**
 * Analyzes topic/tag presence changes across time perspectives
 * Descriptive only - no rankings or performance metrics
 */
export function analyzeTrendSignals(
  assets: ContentAsset[],
  timePerspective: TimePerspective
): TrendSignal[] {
  // Demo data - in production, this would analyze actual historical data
  const demoSignalsData: Omit<TrendSignal, "confidence" | "confidenceDimensions">[] = [
    {
      id: "signal-001",
      topic: "Problem-Solution",
      category: "hook",
      presence: {
        recent: "increasing",
        midTerm: "stable",
        baseline: "decreasing",
      },
      description: "Problem-Solution hooks show increased presence in recent content compared to baseline periods.",
    },
    {
      id: "signal-002",
      topic: "Social Proof",
      category: "narrative",
      presence: {
        recent: "stable",
        midTerm: "increasing",
        baseline: "stable",
      },
      description: "Social Proof narratives maintain consistent presence across recent periods, with growth observed in mid-term context.",
    },
    {
      id: "signal-003",
      topic: "Visual Storytelling",
      category: "visual",
      presence: {
        recent: "emerging",
        midTerm: "emerging",
        baseline: "decreasing",
      },
      description: "Visual Storytelling approaches are emerging as a pattern in recent content creation.",
    },
    {
      id: "signal-004",
      topic: "Conversational Tone",
      category: "tone",
      presence: {
        recent: "increasing",
        midTerm: "increasing",
        baseline: "stable",
      },
      description: "Conversational tone shows sustained increase in presence across recent and mid-term periods.",
    },
    {
      id: "signal-005",
      topic: "Educational Content",
      category: "topic",
      presence: {
        recent: "stable",
        midTerm: "stable",
        baseline: "stable",
      },
      description: "Educational content topics maintain stable presence across all observed time periods.",
    },
  ];

  // Calculate confidence for each signal
  const signals: TrendSignal[] = demoSignalsData.map((signal) => {
    const dimensions = evaluateConfidenceDimensions(signal as TrendSignal);
    const confidence = calculateTrendSignalConfidence(dimensions);
    
    return {
      ...signal,
      confidence,
      confidenceDimensions: dimensions,
    };
  });

  return signals;
}

export function getPresenceChangeLabel(change: PresenceChange): string {
  const labels = {
    increasing: "Increasing",
    stable: "Stable",
    decreasing: "Decreasing",
    emerging: "Emerging",
  };
  return labels[change];
}

