import { CompetitorSignal, MarketContextAnalysis } from "@/types/competitor";
import { StrategyOutput } from "@/types/strategy";
import { NextBestAction } from "./next-best-actions";
import { analyzeEmphasis } from "@/lib/competitor/intelligence/emphasis-analyzer";
import { demoCompetitorContent } from "@/lib/competitor/demo-data/competitor-content";

/**
 * Extracts creative tags from strategies and actions
 */
function extractCreativeTagsFromStrategies(
  strategies: StrategyOutput[]
): Set<string> {
  const tags = new Set<string>();
  
  strategies.forEach((strategy) => {
    // Extract from cluster label
    if (strategy.clusterLabel) {
      tags.add(strategy.clusterLabel.toLowerCase());
    }
    
    // Extract from recommendations
    strategy.recommendations.forEach((rec) => {
      if (rec.creativeGuidance) {
        rec.creativeGuidance.forEach((guidance) => {
          // Simple keyword extraction
          const words = guidance.toLowerCase().split(/\s+/);
          words.forEach((word) => {
            if (word.length > 3) tags.add(word);
          });
        });
      }
    });
  });
  
  return tags;
}

/**
 * Maps competitor signals to market presence
 */
function determineMarketPresence(
  tagName: string,
  tagType: CompetitorSignal["tagType"],
  competitorPatterns: ReturnType<typeof analyzeEmphasis>
): CompetitorSignal["marketPresence"] {
  const relevantPatterns = competitorPatterns.filter(
    (p) => p.signalType === tagType && 
           p.signalName.toLowerCase().includes(tagName.toLowerCase())
  );
  
  if (relevantPatterns.length === 0) {
    return "underrepresented";
  }
  
  const avgPercentage = relevantPatterns.reduce(
    (sum, p) => sum + p.percentage, 0
  ) / relevantPatterns.length;
  
  if (avgPercentage > 40) return "overrepresented";
  if (avgPercentage > 20) return "aligned";
  return "underrepresented";
}

/**
 * Analyzes market context for strategies
 */
export function analyzeMarketContext(
  strategies: StrategyOutput[],
  actions: NextBestAction[]
): MarketContextAnalysis {
  const competitorPatterns = analyzeEmphasis(demoCompetitorContent);
  const strategyTags = extractCreativeTagsFromStrategies(strategies);
  
  const signals: CompetitorSignal[] = [];
  
  // Analyze hooks
  const hookPatterns = competitorPatterns.filter((p) => p.signalType === "hook");
  hookPatterns.forEach((pattern) => {
    const presence = determineMarketPresence(pattern.signalName, "hook", competitorPatterns);
    signals.push({
      tagType: "hook",
      tagName: pattern.signalName,
      marketPresence: presence,
      confidence: pattern.percentage > 30 ? "high" : pattern.percentage > 15 ? "medium" : "low",
    });
  });
  
  // Analyze narratives
  const narrativePatterns = competitorPatterns.filter((p) => p.signalType === "narrative");
  narrativePatterns.forEach((pattern) => {
    const presence = determineMarketPresence(pattern.signalName, "narrative", competitorPatterns);
    signals.push({
      tagType: "narrative",
      tagName: pattern.signalName,
      marketPresence: presence,
      confidence: pattern.percentage > 30 ? "high" : pattern.percentage > 15 ? "medium" : "low",
    });
  });
  
  // Analyze visuals
  const visualPatterns = competitorPatterns.filter((p) => p.signalType === "visual");
  visualPatterns.forEach((pattern) => {
    const presence = determineMarketPresence(pattern.signalName, "visual", competitorPatterns);
    signals.push({
      tagType: "visual",
      tagName: pattern.signalName,
      marketPresence: presence,
      confidence: pattern.percentage > 30 ? "high" : pattern.percentage > 15 ? "medium" : "low",
    });
  });
  
  const overrepresentedTags = signals.filter((s) => s.marketPresence === "overrepresented");
  const underrepresentedTags = signals.filter((s) => s.marketPresence === "underrepresented");
  
  // Determine overall alignment
  const overrepresentedCount = overrepresentedTags.length;
  const underrepresentedCount = underrepresentedTags.length;
  const totalCount = signals.length;
  
  let overallAlignment: MarketContextAnalysis["overallAlignment"] = "aligned";
  if (totalCount > 0 && overrepresentedCount / totalCount > 0.4) {
    overallAlignment = "crowded";
  } else if (totalCount > 0 && underrepresentedCount / totalCount > 0.5) {
    overallAlignment = "divergent";
  }
  
  // Calculate saturation risk
  const saturationRisk: MarketContextAnalysis["saturationRisk"] = 
    overrepresentedCount > 5 ? "high" :
    overrepresentedCount > 2 ? "medium" : "low";
  
  // Calculate divergence risk
  const divergenceRisk: MarketContextAnalysis["divergenceRisk"] =
    underrepresentedCount > 5 ? "high" :
    underrepresentedCount > 2 ? "medium" : "low";
  
  return {
    overallAlignment,
    overrepresentedTags: overrepresentedTags.slice(0, 10),
    underrepresentedTags: underrepresentedTags.slice(0, 10),
    saturationRisk,
    divergenceRisk,
  };
}

/**
 * Gets market context for a specific action
 */
export function getActionMarketContext(
  action: NextBestAction,
  marketAnalysis: MarketContextAnalysis
): "Crowded Market" | "Differentiated" | "Market Neutral" | null {
  // Simple heuristic: if action involves refresh or test, likely differentiated
  if (action.actionType === "refresh" || action.actionType === "test") {
    return "Differentiated";
  }
  
  // If action involves scaling and there are many overrepresented tags, it's crowded
  if (action.actionType === "scale" && marketAnalysis.saturationRisk === "high") {
    return "Crowded Market";
  }
  
  // Default to neutral
  return "Market Neutral";
}

