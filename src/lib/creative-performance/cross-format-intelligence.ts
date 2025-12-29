import {
  CrossFormatCapability,
  CrossFormatTagPerformance,
  FormatStrength,
  StrengthLevel,
  StabilityLevel,
  ConfidenceLevel,
} from "@/types/creative-performance";
import { AdsCreativeAsset } from "@/types/ads";
import { OrganicContentAsset } from "@/types/organic";
import { normalizeCreativeFeatures } from "@/lib/creative-intelligence/feature-mapping";
import { extractCreativeSignals } from "@/lib/organic/creative-signals/signal-extractor";

export interface AggregatedTagData {
  tagId: string;
  tagName: string;
  textCount: number;
  imageCount: number;
  videoCount: number;
  textPerformance: number[];
  imagePerformance: number[];
  videoPerformance: number[];
}

export function analyzeCrossFormatCapability(
  paidAssets: AdsCreativeAsset[],
  organicAssets: OrganicContentAsset[]
): CrossFormatCapability {
  // Aggregate format strengths
  const formatScores = {
    text: [] as number[],
    image: [] as number[],
    video: [] as number[],
  };

  // Process paid assets (all video in current demo)
  paidAssets.forEach((asset) => {
    if (asset.format === "video") {
      formatScores.video.push(0.7); // Mock performance score
    }
  });

  // Process organic assets
  organicAssets.forEach((asset) => {
    if (asset.format === "video") {
      formatScores.video.push(0.65);
    } else if (asset.format === "image") {
      formatScores.image.push(0.6);
    }
  });

  const avgText = formatScores.text.length > 0
    ? formatScores.text.reduce((a, b) => a + b, 0) / formatScores.text.length
    : 0.5;
  const avgImage = formatScores.image.length > 0
    ? formatScores.image.reduce((a, b) => a + b, 0) / formatScores.image.length
    : 0.5;
  const avgVideo = formatScores.video.length > 0
    ? formatScores.video.reduce((a, b) => a + b, 0) / formatScores.video.length
    : 0.5;

  const getStrength = (score: number): StrengthLevel => {
    if (score >= 0.7) return "strong";
    if (score >= 0.5) return "mixed";
    return "weak";
  };

  const stabilities = [avgText, avgImage, avgVideo].filter((s) => s > 0);
  const stabilityVariance =
    stabilities.length > 1
      ? Math.max(...stabilities) - Math.min(...stabilities)
      : 0;
  const overallStability: StabilityLevel =
    stabilityVariance < 0.15 ? "consistent" : "volatile";

  return {
    textStrength: getStrength(avgText),
    imageStrength: getStrength(avgImage),
    videoStrength: getStrength(avgVideo),
    overallStability,
    formatSpecificPatterns: {
      video: [
        "Fast-paced hooks show consistent performance across video formats",
        "Narrative angles maintain engagement in longer video content",
      ],
      image: [
        "Product-centric visuals demonstrate moderate resonance",
        "Scene-based compositions show variable performance",
      ],
      text: [
        "Limited data coverage for text-only creative elements",
      ],
    },
  };
}

export function analyzeTagPerformanceAcrossFormats(
  paidAssets: AdsCreativeAsset[],
  organicAssets: OrganicContentAsset[]
): CrossFormatTagPerformance[] {
  const tagMap = new Map<string, AggregatedTagData>();

  // Process paid assets
  paidAssets.forEach((asset) => {
    const normalized = normalizeCreativeFeatures(asset.creativeFeatures);
    const tagId = `hook-${normalized.hookCategory}`;
    const tagName = normalized.hookCategory;

    if (!tagMap.has(tagId)) {
      tagMap.set(tagId, {
        tagId,
        tagName,
        textCount: 0,
        imageCount: 0,
        videoCount: 0,
        textPerformance: [],
        imagePerformance: [],
        videoPerformance: [],
      });
    }

    const data = tagMap.get(tagId)!;
    if (asset.format === "video") {
      data.videoCount++;
      data.videoPerformance.push(0.7); // Mock score
    }
  });

  // Process organic assets
  organicAssets.forEach((asset) => {
    const signals = extractCreativeSignals(asset);
    const tagId = `hook-${signals.hookCategory}`;
    const tagName = signals.hookCategory;

    if (!tagMap.has(tagId)) {
      tagMap.set(tagId, {
        tagId,
        tagName,
        textCount: 0,
        imageCount: 0,
        videoCount: 0,
        textPerformance: [],
        imagePerformance: [],
        videoPerformance: [],
      });
    }

    const data = tagMap.get(tagId)!;
    if (asset.format === "video") {
      data.videoCount++;
      data.videoPerformance.push(0.65);
    } else if (asset.format === "image") {
      data.imageCount++;
      data.imagePerformance.push(0.6);
    }
  });

  // Convert to CrossFormatTagPerformance
  const results: CrossFormatTagPerformance[] = [];

  tagMap.forEach((data) => {
    const formatStrengths: FormatStrength[] = [];

    if (data.textPerformance.length > 0) {
      const avg = data.textPerformance.reduce((a, b) => a + b, 0) / data.textPerformance.length;
      formatStrengths.push({
        format: "text",
        strength: avg >= 0.7 ? "strong" : avg >= 0.5 ? "mixed" : "weak",
        stability: "consistent",
        confidence: data.textCount >= 5 ? "high" : data.textCount >= 2 ? "medium" : "low",
      });
    }

    if (data.imagePerformance.length > 0) {
      const avg = data.imagePerformance.reduce((a, b) => a + b, 0) / data.imagePerformance.length;
      formatStrengths.push({
        format: "image",
        strength: avg >= 0.7 ? "strong" : avg >= 0.5 ? "mixed" : "weak",
        stability: "consistent",
        confidence: data.imageCount >= 5 ? "high" : data.imageCount >= 2 ? "medium" : "low",
      });
    }

    if (data.videoPerformance.length > 0) {
      const avg = data.videoPerformance.reduce((a, b) => a + b, 0) / data.videoPerformance.length;
      formatStrengths.push({
        format: "video",
        strength: avg >= 0.7 ? "strong" : avg >= 0.5 ? "mixed" : "weak",
        stability: "consistent",
        confidence: data.videoCount >= 5 ? "high" : data.videoCount >= 2 ? "medium" : "low",
      });
    }

    // Calculate cross-format consistency
    const strengths = formatStrengths.map((f) => f.strength);
    const uniqueStrengths = new Set(strengths);
    const consistency: StabilityLevel =
      uniqueStrengths.size === 1 ? "consistent" : "volatile";

    // Overall confidence
    const confidences = formatStrengths.map((f) => f.confidence);
    const overallConfidence: ConfidenceLevel =
      confidences.every((c) => c === "high")
        ? "high"
        : confidences.some((c) => c === "high")
        ? "medium"
        : "low";

    results.push({
      tagId: data.tagId,
      tagName: data.tagName,
      formatStrengths,
      crossFormatConsistency: consistency,
      overallConfidence,
    });
  });

  return results;
}

