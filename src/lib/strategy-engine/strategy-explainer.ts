import { StrategyContext, StrategyRecommendation } from "@/types/strategy";

export function explainStrategy(
  context: StrategyContext,
  recommendations: StrategyRecommendation[]
): string {
  let explanation = "";

  // Pattern type explanation
  if (context.patternType === "cross_platform_stable") {
    explanation += "This pattern is stable across platforms and safe to scale. ";
  } else if (context.patternType === "platform_sensitive") {
    explanation += "This pattern shows platform sensitivity, requiring platform-specific strategy adjustments. ";
  } else {
    explanation += "This pattern is platform-specific and should be managed independently per channel. ";
  }

  // Fatigue summary
  const platforms = Object.keys(context.fatigueSummary) as Array<keyof typeof context.fatigueSummary>;
  if (platforms.length > 0) {
    const healthyPlatforms = platforms.filter((p) => context.fatigueSummary[p] === "healthy");
    const fatiguedPlatforms = platforms.filter((p) => context.fatigueSummary[p] === "fatigued");
    const warningPlatforms = platforms.filter((p) => context.fatigueSummary[p] === "warning");

    if (healthyPlatforms.length > 0 && fatiguedPlatforms.length === 0) {
      explanation += `Performance remains strong on ${healthyPlatforms.join(", ")}. `;
    } else if (fatiguedPlatforms.length > 0) {
      explanation += `${fatiguedPlatforms.join(", ")} ${fatiguedPlatforms.length === 1 ? "shows" : "show"} fatigue, while ${healthyPlatforms.length > 0 ? `${healthyPlatforms.join(", ")} remain${healthyPlatforms.length === 1 ? "s" : ""} healthy` : "other platforms require monitoring"}. `;
    } else if (warningPlatforms.length > 0) {
      explanation += `Early warning signs detected on ${warningPlatforms.join(", ")}. `;
    }
  }

  // Scale reliability
  if (context.scaleReliability === "reliable") {
    explanation += "The pattern demonstrates reliable scaling potential. ";
  } else if (context.scaleReliability === "moderate") {
    explanation += "Scaling should be approached with caution. ";
  } else {
    explanation += "This pattern is unstable for scaling. ";
  }

  // Action summary
  const scaleActions = recommendations.filter((r) => r.recommendedAction === "scale");
  const refreshActions = recommendations.filter((r) => r.recommendedAction === "refresh_creative");
  const pauseActions = recommendations.filter((r) => r.recommendedAction === "pause");

  if (scaleActions.length > 0) {
    explanation += `Scale recommended on ${scaleActions.map((r) => r.platform).join(", ")}. `;
  }

  if (refreshActions.length > 0) {
    explanation += `Creative refresh needed on ${refreshActions.map((r) => r.platform).join(", ")}. `;
  }

  if (pauseActions.length > 0) {
    explanation += `Pause spending on ${pauseActions.map((r) => r.platform).join(", ")} until refresh is ready. `;
  }

  return explanation.trim();
}

