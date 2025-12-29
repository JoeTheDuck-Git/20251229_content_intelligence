import { AdsCreativeAsset, AdsPerformanceMetrics } from "@/types/ads";
import { normalizeCreativeFeatures } from "@/lib/creative-intelligence/feature-mapping";

export interface PerformancePattern {
  pattern: string;
  description: string;
  confidence: "high" | "medium" | "low";
}

export function analyzePerformancePatterns(
  asset: AdsCreativeAsset,
  metrics: AdsPerformanceMetrics[]
): PerformancePattern[] {
  const patterns: PerformancePattern[] = [];
  const normalized = normalizeCreativeFeatures(asset.creativeFeatures);
  const latest = metrics[metrics.length - 1];

  // Rule: Fast pacing + short duration → higher CTR
  if (normalized.pacingCategory === "fast" && asset.duration <= 30) {
    if (latest.ctr > 5) {
      patterns.push({
        pattern: "fast-short-high-ctr",
        description: "Fast pacing with short duration drives high CTR",
        confidence: "high",
      });
    }
  }

  // Rule: High CTR + low ROAS → conversion mismatch
  if (latest.ctr > 5 && latest.roas < 3) {
    patterns.push({
      pattern: "high-ctr-low-roas",
      description: "High engagement but low conversion suggests post-click optimization issues",
      confidence: "high",
    });
  }

  // Rule: Talking head + high frequency → fatigue risk
  if (
    normalized.voiceCategory === "talking-head" &&
    latest.frequency > 3
  ) {
    patterns.push({
      pattern: "talking-head-high-frequency",
      description: "Talking head format with high frequency shows fatigue risk",
      confidence: "medium",
    });
  }

  // Rule: High visual density + fast pacing → attention capture
  if (
    normalized.visualComplexity === "high" &&
    normalized.pacingCategory === "fast"
  ) {
    if (latest.ctr > 4.5) {
      patterns.push({
        pattern: "high-visual-fast-pacing",
        description: "High visual density with fast pacing effectively captures attention",
        confidence: "high",
      });
    }
  }

  return patterns;
}

export function identifyKeyDrivers(
  asset: AdsCreativeAsset,
  metrics: AdsPerformanceMetrics[]
): string[] {
  const drivers: string[] = [];
  const normalized = normalizeCreativeFeatures(asset.creativeFeatures);
  const latest = metrics[metrics.length - 1];

  if (latest.ctr > 5) {
    if (normalized.pacingCategory === "fast") {
      drivers.push("Fast pacing drives high CTR");
    }
    if (normalized.visualComplexity === "high") {
      drivers.push("High visual density enhances engagement");
    }
  }

  if (latest.roas > 4) {
    if (normalized.hookCategory === "problem-solving") {
      drivers.push("Problem-solution hooks drive conversions");
    }
  }

  return drivers;
}

