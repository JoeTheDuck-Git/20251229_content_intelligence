import { CompetitorContentAsset, EmphasisPattern, SignalType, TrendDirection } from "@/types/competitor";
import { aggregateKeywords } from "../signal-extraction/caption-keyword-extractor";
import { aggregateHookPatterns } from "../signal-extraction/hook-pattern-extractor";
import { extractVisualSignals } from "../signal-extraction/visual-signal-extractor";

export function analyzeEmphasis(
  assets: CompetitorContentAsset[]
): EmphasisPattern[] {
  const patterns: EmphasisPattern[] = [];
  const totalAssets = assets.length;

  // Analyze keywords
  const keywords = aggregateKeywords(assets);
  keywords.slice(0, 10).forEach(({ keyword, frequency }) => {
    patterns.push({
      signalType: "keyword",
      signalName: keyword,
      frequency,
      percentage: (frequency / totalAssets) * 100,
      trendDirection: "stable", // Will be updated by temporal analysis
    });
  });

  // Analyze hook patterns
  const hooks = aggregateHookPatterns(assets);
  hooks.forEach(({ hookStyle, frequency }) => {
    patterns.push({
      signalType: "hook",
      signalName: hookStyle,
      frequency,
      percentage: (frequency / totalAssets) * 100,
      trendDirection: "stable",
    });
  });

  // Analyze visual focus
  const visualSignals = extractVisualSignals(assets);
  visualSignals.forEach(({ visualFocus, frequency }) => {
    patterns.push({
      signalType: "visual",
      signalName: visualFocus,
      frequency,
      percentage: (frequency / totalAssets) * 100,
      trendDirection: "stable",
    });
  });

  // Analyze narrative angles
  const narrativeCounts: Record<string, number> = {};
  assets.forEach((asset) => {
    const angle = asset.creativeSignals.narrativeAngle;
    narrativeCounts[angle] = (narrativeCounts[angle] || 0) + 1;
  });

  Object.entries(narrativeCounts).forEach(([angle, frequency]) => {
    patterns.push({
      signalType: "narrative",
      signalName: angle,
      frequency,
      percentage: (frequency / totalAssets) * 100,
      trendDirection: "stable",
    });
  });

  return patterns.sort((a, b) => b.frequency - a.frequency);
}

export function getDominantThemes(patterns: EmphasisPattern[], topN: number = 5): EmphasisPattern[] {
  return patterns.slice(0, topN);
}

