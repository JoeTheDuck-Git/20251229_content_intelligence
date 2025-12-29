import { DurationBucket, Pacing, VisualDensity } from "@/types/clustering";
import { AdsCreativeAsset } from "@/types/ads";

export function normalizeDuration(duration: number): DurationBucket {
  if (duration <= 20) {
    return "short";
  } else if (duration <= 45) {
    return "mid";
  } else {
    return "long";
  }
}

export function normalizePacing(pacing: string): Pacing {
  const normalized = pacing.toLowerCase();
  if (normalized === "fast" || normalized === "quick") {
    return "fast";
  } else if (normalized === "slow" || normalized === "slow-paced") {
    return "slow";
  } else {
    return "medium";
  }
}

export function normalizeVisualDensity(density: string): VisualDensity {
  const normalized = density.toLowerCase();
  if (normalized === "high" || normalized === "dense") {
    return "high";
  } else if (normalized === "low" || normalized === "minimal") {
    return "low";
  } else {
    return "medium";
  }
}

export function normalizeHookType(hookType: string): string {
  // Normalize hook types into standard categories
  const hookMap: Record<string, string> = {
    "Question Hook": "question",
    "Problem-Solution": "problem-solving",
    "Story Hook": "narrative",
    "Shock Value": "attention-grab",
  };

  return hookMap[hookType] || hookType.toLowerCase().replace(/\s+/g, "-");
}

export function normalizeVoiceType(voiceType: string): string {
  // Normalize voice types
  const voiceMap: Record<string, string> = {
    "voiceover": "voiceover",
    "talking-head": "talking-head",
    "text-only": "text-only",
  };

  return voiceMap[voiceType.toLowerCase()] || voiceType.toLowerCase();
}

export function normalizeCreativeAsset(asset: AdsCreativeAsset) {
  return {
    assetId: asset.id,
    hookType: normalizeHookType(asset.creativeFeatures.hookType),
    pacing: normalizePacing(asset.creativeFeatures.pacing),
    voiceType: normalizeVoiceType(asset.creativeFeatures.voiceType),
    visualDensity: normalizeVisualDensity(asset.creativeFeatures.visualDensity),
    durationBucket: normalizeDuration(asset.duration),
  };
}

