import { TrendInterpretation } from "@/types/trend";
import { TrendSignal } from "@/types/trend";

/**
 * Generates narrative interpretation of observed trend patterns
 * Descriptive only - no prescriptive language
 */
export function generateTrendInterpretation(
  signals: TrendSignal[]
): TrendInterpretation[] {
  const interpretations: TrendInterpretation[] = [
    {
      id: "interpretation-001",
      title: "Hook Pattern Evolution",
      narrative: "Content creation shows a shift toward Problem-Solution hooks in recent periods. This pattern represents a change from baseline approaches, where such hooks were less frequently observed. The mid-term period shows stability, suggesting this shift occurred relatively recently.",
      observedPatterns: [
        "Problem-Solution hooks increased in recent content",
        "Baseline periods showed lower presence of this hook type",
        "Mid-term period indicates transition phase",
      ],
      confidence: "high",
    },
    {
      id: "interpretation-002",
      title: "Visual Approach Development",
      narrative: "Visual Storytelling approaches are emerging as a consistent pattern. This emergence is observed across both recent and mid-term periods, indicating a sustained shift in visual content creation strategies. Baseline periods showed declining presence, suggesting this represents a new direction rather than a return to previous patterns.",
      observedPatterns: [
        "Visual Storytelling emerging in recent periods",
        "Sustained emergence across mid-term context",
        "Baseline showed declining presence",
      ],
      confidence: "high",
    },
    {
      id: "interpretation-003",
      title: "Tone Consistency",
      narrative: "Conversational tone demonstrates increasing presence across recent and mid-term periods. This pattern suggests a sustained emphasis on conversational approaches rather than a temporary shift. The consistency across multiple time perspectives indicates this may represent an ongoing evolution in content voice.",
      observedPatterns: [
        "Conversational tone increasing in recent content",
        "Sustained increase across mid-term period",
        "Baseline shows stable presence before increase",
      ],
      confidence: "medium",
    },
  ];

  return interpretations;
}

