import {
  TimePerspective,
  TagStability,
  TagStabilityLevel,
  TagEvolutionInsight,
  StrengthLevel,
  StabilityLevel,
} from "@/types/creative-performance";

/**
 * Compute tag stability across time perspectives
 * This is demo data - in production, this would analyze actual historical data
 */
export function computeTagStability(
  tagName: string,
  currentStrength: StrengthLevel,
  currentStability: StabilityLevel
): TagStability {
  // Demo logic: simulate stability patterns
  // In production, this would analyze actual data across time windows
  
  const stabilityMap: Record<string, TagStability> = {
    "Problem-Solution": {
      recent: "strong",
      midTerm: "strong",
      baseline: "strong",
    },
    "Social Proof": {
      recent: "strong",
      midTerm: "mixed",
      baseline: "weak",
    },
    "Urgency": {
      recent: "mixed",
      midTerm: "weak",
      baseline: "weak",
    },
    "Curiosity Gap": {
      recent: "strong",
      midTerm: "strong",
      baseline: "mixed",
    },
  };

  // Default: use current strength/stability to infer pattern
  if (stabilityMap[tagName]) {
    return stabilityMap[tagName];
  }

  // Fallback: generate based on current state
  if (currentStrength === "strong" && currentStability === "consistent") {
    return {
      recent: "strong",
      midTerm: "strong",
      baseline: "strong",
    };
  } else if (currentStrength === "strong" && currentStability === "volatile") {
    return {
      recent: "strong",
      midTerm: "mixed",
      baseline: "weak",
    };
  } else {
    return {
      recent: "mixed",
      midTerm: "weak",
      baseline: "weak",
    };
  }
}

/**
 * Classify tag evolution pattern based on stability across time
 */
export function classifyTagEvolution(stability: TagStability): TagEvolutionInsight["classification"] {
  const { recent, midTerm, baseline } = stability;

  // Consistent Capability: strong across all perspectives
  if (recent === "strong" && midTerm === "strong" && baseline === "strong") {
    return "Consistent Capability";
  }

  // Emerging Pattern: improving over time
  if (
    (recent === "strong" && midTerm === "mixed" && baseline === "weak") ||
    (recent === "strong" && midTerm === "strong" && baseline === "weak")
  ) {
    return "Emerging Pattern";
  }

  // Decaying Element: declining over time
  if (
    (recent === "weak" && midTerm === "mixed" && baseline === "strong") ||
    (recent === "weak" && midTerm === "weak" && baseline === "strong")
  ) {
    return "Decaying Element";
  }

  // Volatile Signal: inconsistent pattern
  return "Volatile Signal";
}

/**
 * Generate plain English interpretation
 */
export function generateEvolutionInterpretation(
  classification: TagEvolutionInsight["classification"],
  stability: TagStability
): string {
  switch (classification) {
    case "Consistent Capability":
      return "This creative element remains consistently strong across time perspectives.";
    
    case "Emerging Pattern":
      return "Recent strength does not yet indicate long-term capability.";
    
    case "Decaying Element":
      return "Performance appears to be declining relative to historical baseline.";
    
    case "Volatile Signal":
      return "This element shows inconsistent patterns across different time perspectives.";
    
    default:
      return "Time-based analysis reveals evolving patterns in this creative element.";
  }
}

/**
 * Get stability level for a specific time perspective
 */
export function getStabilityForPerspective(
  stability: TagStability,
  perspective: TimePerspective
): TagStabilityLevel {
  switch (perspective) {
    case "Recent":
      return stability.recent;
    case "MidTerm":
      return stability.midTerm;
    case "Baseline":
      return stability.baseline;
  }
}

/**
 * Generate market context note (if competitor signals exist)
 */
export function generateMarketContextNote(
  tagName: string,
  internalStability: TagStability,
  hasCompetitorData: boolean
): string | undefined {
  if (!hasCompetitorData) return undefined;

  // Demo logic: generate contextual note
  if (internalStability.recent === "strong" && internalStability.baseline === "strong") {
    return "While internal performance remains stable, market usage has increased recently.";
  }

  return undefined;
}

/**
 * Complete tag evolution insight
 */
export function generateTagEvolutionInsight(
  tagName: string,
  currentStrength: StrengthLevel,
  currentStability: StabilityLevel,
  hasCompetitorData: boolean = false
): TagEvolutionInsight {
  const stability = computeTagStability(tagName, currentStrength, currentStability);
  const classification = classifyTagEvolution(stability);
  const interpretation = generateEvolutionInterpretation(classification, stability);
  const marketContextNote = generateMarketContextNote(tagName, stability, hasCompetitorData);

  return {
    stability,
    classification,
    interpretation,
    marketContextNote,
  };
}

