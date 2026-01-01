import { TrendSignal, TrendStrategicInterpretation } from "@/types/trend";

/**
 * Generates strategic interpretation from Trend Signal
 * Interpretation only - no recommendations or execution instructions
 * Follows Strategy OS Language Guidelines
 */
export function generateStrategicInterpretation(
  signal: TrendSignal
): TrendStrategicInterpretation {
  const interpretation = buildInterpretationForSignal(signal);
  return interpretation;
}

function buildInterpretationForSignal(
  signal: TrendSignal
): TrendStrategicInterpretation {
  const { recent, midTerm, baseline } = signal.presence;
  
  // Determine observed contexts based on signal category
  const contexts = inferObservedContexts(signal);
  
  // Build observation
  const observation = buildObservation(signal, contexts);
  
  // Build interpretation
  const interpretation = buildInterpretation(signal);
  
  // Build strategic implication
  const strategicImplication = buildStrategicImplication(signal);
  
  // Build applicability scope
  const applicabilityScope = buildApplicabilityScope(signal);
  
  // Build caution boundary
  const cautionBoundary = buildCautionBoundary(signal);
  
  return {
    id: `strategic-interpretation-${signal.id}`,
    signalId: signal.id,
    signalTopic: signal.topic,
    signalCategory: signal.category,
    observation,
    interpretation,
    strategicImplication,
    applicabilityScope,
    cautionBoundary,
  };
}

function inferObservedContexts(signal: TrendSignal) {
  // In production, this would analyze actual data
  // For demo, infer based on category
  const formatMap: Record<TrendSignal["category"], ("text" | "image" | "video")[]> = {
    hook: ["text", "video"],
    narrative: ["text", "video"],
    visual: ["image", "video"],
    tone: ["text", "video"],
    topic: ["text", "image", "video"],
  };
  
  const channelMap: Record<TrendSignal["category"], ("Meta" | "TikTok" | "YouTube")[]> = {
    hook: ["Meta", "TikTok", "YouTube"],
    narrative: ["YouTube", "Meta"],
    visual: ["TikTok", "Meta"],
    tone: ["Meta", "TikTok", "YouTube"],
    topic: ["Meta", "TikTok", "YouTube"],
  };
  
  return {
    formats: formatMap[signal.category] || ["text", "image", "video"],
    channels: channelMap[signal.category] || ["Meta", "TikTok", "YouTube"],
  };
}

function buildObservation(
  signal: TrendSignal,
  contexts: ReturnType<typeof inferObservedContexts>
) {
  const { recent, midTerm, baseline } = signal.presence;
  const timePeriods: ("recent" | "midTerm" | "baseline")[] = [];
  
  if (recent !== "decreasing") timePeriods.push("recent");
  if (midTerm !== "decreasing") timePeriods.push("midTerm");
  if (baseline !== "decreasing") timePeriods.push("baseline");
  
  let description = `Observed ${signal.topic} ${signal.category} patterns show `;
  
  if (recent === "increasing" && midTerm === "increasing") {
    description += "sustained increase in presence across recent and mid-term periods. ";
  } else if (recent === "emerging" && midTerm === "emerging") {
    description += "emerging presence pattern observed across recent and mid-term periods. ";
  } else if (recent === "stable" && midTerm === "stable" && baseline === "stable") {
    description += "stable presence maintained across all observed time periods. ";
  } else if (recent === "increasing" && baseline === "decreasing") {
    description += "shift from lower baseline presence to increased recent presence. ";
  } else {
    description += "varied presence patterns across different time perspectives. ";
  }
  
  description += `This observation is based on content analysis across ${contexts.formats.join(", ")} formats and ${contexts.channels.join(", ")} channels.`;
  
  return {
    description,
    confidence: signal.confidence,
    observedContexts: {
      formats: contexts.formats,
      channels: contexts.channels,
      timePeriods,
    },
  };
}

function buildInterpretation(signal: TrendSignal) {
  const { recent, midTerm, baseline } = signal.presence;
  
  let exploratoryStatement = "";
  let patternDescription = "";
  
  if (recent === "increasing" && midTerm === "increasing" && baseline === "stable") {
    exploratoryStatement = "This pattern may indicate a sustained shift in content creation approaches rather than a temporary fluctuation.";
    patternDescription = "The consistent increase across recent and mid-term periods, starting from a stable baseline, suggests this may represent an evolving pattern in content strategy.";
  } else if (recent === "emerging" && midTerm === "emerging") {
    exploratoryStatement = "This emerging pattern could suggest a new direction in content creation, distinct from previous baseline approaches.";
    patternDescription = "The emergence across both recent and mid-term periods, contrasted with baseline decline, may indicate a shift toward new creative approaches.";
  } else if (recent === "stable" && midTerm === "stable" && baseline === "stable") {
    exploratoryStatement = "This stable pattern may indicate consistent emphasis on this element across observed time periods.";
    patternDescription = "The consistent presence across all time perspectives suggests this element has been maintained as a regular part of content creation.";
  } else if (recent === "increasing" && midTerm === "stable" && baseline === "decreasing") {
    exploratoryStatement = "This pattern could suggest a recent shift toward increased emphasis on this element.";
    patternDescription = "The transition from lower baseline presence to increased recent presence, with stable mid-term period, may indicate a deliberate shift in approach.";
  } else {
    exploratoryStatement = "This varied pattern may indicate evolving approaches to this element across different time periods.";
    patternDescription = "The presence changes across time perspectives suggest this element's role may have evolved over the observed periods.";
  }
  
  return {
    exploratoryStatement,
    patternDescription,
  };
}

function buildStrategicImplication(signal: TrendSignal) {
  const { recent, midTerm, baseline } = signal.presence;
  
  let whyItMatters = "";
  let contextualRelevance = "";
  
  if (signal.category === "hook") {
    whyItMatters = "Hook patterns may influence initial audience engagement. Changes in hook presence could indicate shifts in how content attempts to capture attention.";
    contextualRelevance = "This observation may be relevant for understanding how content approaches initial engagement, though it does not indicate effectiveness or recommend specific approaches.";
  } else if (signal.category === "narrative") {
    whyItMatters = "Narrative patterns may relate to how content structures its message. Presence changes could indicate evolving storytelling approaches.";
    contextualRelevance = "This observation may be relevant for understanding narrative strategy evolution, though it does not suggest which narratives are more effective.";
  } else if (signal.category === "visual") {
    whyItMatters = "Visual patterns may relate to content presentation approaches. Changes in visual presence could indicate shifts in creative direction.";
    contextualRelevance = "This observation may be relevant for understanding visual strategy trends, though it does not indicate which visual approaches perform better.";
  } else if (signal.category === "tone") {
    whyItMatters = "Tone patterns may relate to how content communicates with audiences. Presence changes could indicate shifts in communication style.";
    contextualRelevance = "This observation may be relevant for understanding tone strategy evolution, though it does not suggest which tones are more effective.";
  } else {
    whyItMatters = "Topic patterns may relate to content subject matter choices. Presence changes could indicate shifts in content focus areas.";
    contextualRelevance = "This observation may be relevant for understanding topic strategy trends, though it does not indicate which topics perform better.";
  }
  
  return {
    whyItMatters,
    contextualRelevance,
  };
}

function buildApplicabilityScope(signal: TrendSignal) {
  const contexts = inferObservedContexts(signal);
  
  let funnelStages: ("awareness" | "consideration" | "conversion")[] | undefined;
  let notes: string | undefined;
  
  if (signal.category === "hook") {
    funnelStages = ["awareness"];
    notes = "Hook patterns are typically observed in awareness-stage content.";
  } else if (signal.category === "narrative") {
    funnelStages = ["awareness", "consideration"];
    notes = "Narrative patterns may appear across awareness and consideration stages.";
  } else {
    funnelStages = ["awareness", "consideration", "conversion"];
    notes = "This pattern may be observed across multiple funnel stages.";
  }
  
  return {
    relevantFormats: contexts.formats,
    relevantChannels: contexts.channels,
    funnelStages,
    notes,
  };
}

function buildCautionBoundary(signal: TrendSignal) {
  const nonCausality = `This observation describes presence patterns only. It does not establish causation between ${signal.topic} presence and any performance outcomes. Correlation does not imply effectiveness.`;
  
  const nonGuarantees = `This observation does not guarantee that ${signal.topic} patterns will continue, nor does it predict future performance. Past presence patterns do not ensure future results.`;
  
  const interpretationLimits = `This interpretation is based on observed presence changes only. It does not account for external factors, market conditions, or performance metrics. This information should not be used as the sole basis for strategic decisions.`;
  
  return {
    nonCausality,
    nonGuarantees,
    interpretationLimits,
  };
}

