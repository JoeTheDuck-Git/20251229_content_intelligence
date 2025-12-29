import { CompetitorContentAsset, CompetitorSignalTrend, SignalType, TrendDirection } from "@/types/competitor";
import { aggregateKeywords } from "../signal-extraction/caption-keyword-extractor";
import { aggregateHookPatterns } from "../signal-extraction/hook-pattern-extractor";
import { extractVisualSignals } from "../signal-extraction/visual-signal-extractor";

function getDateRange(days: number): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { start, end };
}

export function detectTemporalShifts(
  competitorId: string,
  allAssets: CompetitorContentAsset[],
  recentDays: number = 30
): CompetitorSignalTrend[] {
  const { start: recentStart } = getDateRange(recentDays);
  const { start: historicalStart } = getDateRange(recentDays * 2);

  const recentAssets = allAssets.filter(
    (asset) =>
      asset.competitorId === competitorId &&
      new Date(asset.publishDate) >= recentStart
  );

  const historicalAssets = allAssets.filter(
    (asset) =>
      asset.competitorId === competitorId &&
      new Date(asset.publishDate) >= historicalStart &&
      new Date(asset.publishDate) < recentStart
  );

  const trends: CompetitorSignalTrend[] = [];

  // Analyze keyword shifts
  const recentKeywords = aggregateKeywords(recentAssets);
  const historicalKeywords = aggregateKeywords(historicalAssets);

  const keywordMap = new Map<string, number>();
  historicalKeywords.forEach(({ keyword, frequency }) => {
    keywordMap.set(keyword, frequency);
  });

  recentKeywords.forEach(({ keyword, frequency }) => {
    const historicalFreq = keywordMap.get(keyword) || 0;
    const change = historicalFreq > 0 
      ? ((frequency - historicalFreq) / historicalFreq) * 100 
      : 100;

    let direction: TrendDirection = "stable";
    if (change > 20) direction = "emerging";
    else if (change < -20) direction = "declining";

    if (Math.abs(change) > 10) {
      trends.push({
        competitorId,
        signalType: "keyword",
        signalName: keyword,
        trendDirection: direction,
        frequency,
        changePercentage: change,
      });
    }
  });

  // Analyze hook pattern shifts
  const recentHooks = aggregateHookPatterns(recentAssets);
  const historicalHooks = aggregateHookPatterns(historicalAssets);

  const hookMap = new Map<string, number>();
  historicalHooks.forEach(({ hookStyle, frequency }) => {
    hookMap.set(hookStyle, frequency);
  });

  recentHooks.forEach(({ hookStyle, frequency }) => {
    const historicalFreq = hookMap.get(hookStyle) || 0;
    const change = historicalFreq > 0 
      ? ((frequency - historicalFreq) / historicalFreq) * 100 
      : 100;

    let direction: TrendDirection = "stable";
    if (change > 20) direction = "emerging";
    else if (change < -20) direction = "declining";

    if (Math.abs(change) > 10) {
      trends.push({
        competitorId,
        signalType: "hook",
        signalName: hookStyle,
        trendDirection: direction,
        frequency,
        changePercentage: change,
      });
    }
  });

  // Analyze visual focus shifts
  const recentVisual = extractVisualSignals(recentAssets);
  const historicalVisual = extractVisualSignals(historicalAssets);

  const visualMap = new Map<string, number>();
  historicalVisual.forEach(({ visualFocus, frequency }) => {
    visualMap.set(visualFocus, frequency);
  });

  recentVisual.forEach(({ visualFocus, frequency }) => {
    const historicalFreq = visualMap.get(visualFocus) || 0;
    const change = historicalFreq > 0 
      ? ((frequency - historicalFreq) / historicalFreq) * 100 
      : 100;

    let direction: TrendDirection = "stable";
    if (change > 20) direction = "emerging";
    else if (change < -20) direction = "declining";

    if (Math.abs(change) > 10) {
      trends.push({
        competitorId,
        signalType: "visual",
        signalName: visualFocus,
        trendDirection: direction,
        frequency,
        changePercentage: change,
      });
    }
  });

  return trends;
}

