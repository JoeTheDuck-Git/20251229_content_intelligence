import { TrendSignal, PresenceChange } from "@/types/trend";

export type ConfidenceDimension = "strong" | "consistent" | "weak";

export interface ConfidenceDimensions {
  presenceConsistency: ConfidenceDimension;
  temporalStability: ConfidenceDimension;
  contextDiversity: ConfidenceDimension;
  signalCoherence: ConfidenceDimension;
}

/**
 * Evaluates Presence Consistency dimension
 * Strong: All three periods show same presence
 * Consistent: Two periods show same presence
 * Weak: All periods show different presence
 */
function evaluatePresenceConsistency(
  presence: TrendSignal["presence"]
): ConfidenceDimension {
  const { recent, midTerm, baseline } = presence;
  
  if (recent === midTerm && midTerm === baseline) {
    return "strong";
  }
  
  if (recent === midTerm || midTerm === baseline || recent === baseline) {
    return "consistent";
  }
  
  return "weak";
}

/**
 * Evaluates Temporal Stability dimension
 * Strong: Stable across all periods or gradual progression
 * Consistent: Moderate change pattern
 * Weak: Volatile or only recent presence
 */
function evaluateTemporalStability(
  presence: TrendSignal["presence"]
): ConfidenceDimension {
  const { recent, midTerm, baseline } = presence;
  
  // All stable = strong
  if (recent === "stable" && midTerm === "stable" && baseline === "stable") {
    return "strong";
  }
  
  // Gradual progression patterns (coherent changes)
  const isGradualProgression = 
    (recent === "increasing" && midTerm === "increasing" && baseline === "stable") ||
    (recent === "increasing" && midTerm === "stable" && baseline === "decreasing") ||
    (recent === "stable" && midTerm === "increasing" && baseline === "stable") ||
    (recent === "emerging" && midTerm === "emerging" && baseline === "decreasing");
  
  if (isGradualProgression) {
    return "strong";
  }
  
  // Two periods same = consistent
  if (recent === midTerm || midTerm === baseline || recent === baseline) {
    return "consistent";
  }
  
  // Only recent presence (emerging only in recent) = weak
  if (recent === "emerging" && midTerm !== "emerging" && baseline !== "emerging") {
    return "weak";
  }
  
  // All different = weak
  if (recent !== midTerm && midTerm !== baseline && recent !== baseline) {
    return "weak";
  }
  
  return "consistent";
}

/**
 * Evaluates Context Diversity dimension
 * For individual signals, this checks if presence spans all time periods
 * Strong: Present across all periods (not just recent)
 * Consistent: Present in two periods
 * Weak: Only in recent period
 */
function evaluateContextDiversity(
  presence: TrendSignal["presence"]
): ConfidenceDimension {
  const { recent, midTerm, baseline } = presence;
  
  // Not "decreasing" or absent in any period = strong diversity
  const hasPresenceInAll = 
    recent !== "decreasing" && 
    midTerm !== "decreasing" && 
    baseline !== "decreasing";
  
  if (hasPresenceInAll) {
    return "strong";
  }
  
  // Present in two periods
  const presentInTwo = 
    (recent !== "decreasing" && midTerm !== "decreasing") ||
    (midTerm !== "decreasing" && baseline !== "decreasing") ||
    (recent !== "decreasing" && baseline !== "decreasing");
  
  if (presentInTwo) {
    return "consistent";
  }
  
  // Only recent presence
  if (recent !== "decreasing" && midTerm === "decreasing" && baseline === "decreasing") {
    return "weak";
  }
  
  return "consistent";
}

/**
 * Evaluates Signal Coherence dimension
 * Strong: Logical pattern progression
 * Consistent: Some coherence
 * Weak: Contradictory or only recent
 */
function evaluateSignalCoherence(
  presence: TrendSignal["presence"]
): ConfidenceDimension {
  const { recent, midTerm, baseline } = presence;
  
  // Coherent patterns
  const coherentPatterns = [
    // Gradual increase
    recent === "increasing" && midTerm === "increasing" && baseline === "stable",
    recent === "increasing" && midTerm === "stable" && baseline === "decreasing",
    // Emerging pattern
    recent === "emerging" && midTerm === "emerging" && baseline === "decreasing",
    // Stable maintenance
    recent === "stable" && midTerm === "stable" && baseline === "stable",
    // Recovery pattern
    recent === "increasing" && midTerm === "stable" && baseline === "stable",
  ];
  
  if (coherentPatterns.some(pattern => pattern)) {
    return "strong";
  }
  
  // Contradictory patterns (e.g., increasing then decreasing then increasing)
  const isContradictory = 
    (recent === "increasing" && baseline === "increasing" && midTerm === "decreasing") ||
    (recent === "decreasing" && baseline === "decreasing" && midTerm === "increasing");
  
  if (isContradictory) {
    return "weak";
  }
  
  // Only recent presence
  if (recent !== "stable" && recent !== "decreasing" && 
      midTerm === "decreasing" && baseline === "decreasing") {
    return "weak";
  }
  
  return "consistent";
}

/**
 * Calculates confidence level based on four dimensions
 * High: at least 3 dimensions show strong signals
 * Medium: 2 dimensions show consistent signals
 * Low: only 1 dimension or recent-only presence
 */
export function calculateTrendSignalConfidence(
  dimensions: ConfidenceDimensions
): "high" | "medium" | "low" {
  const strongCount = Object.values(dimensions).filter(d => d === "strong").length;
  const consistentCount = Object.values(dimensions).filter(d => d === "consistent").length;
  const weakCount = Object.values(dimensions).filter(d => d === "weak").length;
  
  // High: at least 3 dimensions show strong
  if (strongCount >= 3) {
    return "high";
  }
  
  // Medium: 2 dimensions show consistent (or 2 strong + 1 consistent, etc.)
  if (strongCount >= 2 || (strongCount >= 1 && consistentCount >= 2)) {
    return "medium";
  }
  
  // Low: only 1 dimension strong, or mostly weak, or recent-only
  if (strongCount === 1 && weakCount >= 2) {
    return "low";
  }
  
  // Default medium if mixed
  if (consistentCount >= 2) {
    return "medium";
  }
  
  return "low";
}

/**
 * Evaluates all confidence dimensions for a trend signal
 */
export function evaluateConfidenceDimensions(
  signal: TrendSignal
): ConfidenceDimensions {
  return {
    presenceConsistency: evaluatePresenceConsistency(signal.presence),
    temporalStability: evaluateTemporalStability(signal.presence),
    contextDiversity: evaluateContextDiversity(signal.presence),
    signalCoherence: evaluateSignalCoherence(signal.presence),
  };
}

/**
 * Generates explanation text for confidence level
 */
export function getConfidenceExplanation(
  dimensions: ConfidenceDimensions,
  confidence: "high" | "medium" | "low"
): string {
  const dimensionLabels = {
    presenceConsistency: "Presence Consistency",
    temporalStability: "Temporal Stability",
    contextDiversity: "Context Diversity",
    signalCoherence: "Signal Coherence",
  };
  
  const strongDimensions = Object.entries(dimensions)
    .filter(([_, value]) => value === "strong")
    .map(([key]) => dimensionLabels[key as keyof typeof dimensionLabels]);
  
  const consistentDimensions = Object.entries(dimensions)
    .filter(([_, value]) => value === "consistent")
    .map(([key]) => dimensionLabels[key as keyof typeof dimensionLabels]);
  
  let explanation = `Confidence: ${confidence.toUpperCase()}. `;
  explanation += "This reflects observation reliability, not effectiveness. ";
  
  if (strongDimensions.length > 0) {
    explanation += `Strong signals in: ${strongDimensions.join(", ")}. `;
  }
  
  if (consistentDimensions.length > 0 && strongDimensions.length < 3) {
    explanation += `Consistent signals in: ${consistentDimensions.join(", ")}. `;
  }
  
  explanation += "This confidence indicates how reliably the pattern is observed across time periods and contexts.";
  
  return explanation;
}

