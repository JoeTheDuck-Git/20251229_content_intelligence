import { CreativeSignature, FatigueStatus } from "@/types/clustering";
import { AdsCreativeAsset } from "@/types/ads";
import { normalizeCreativeAsset } from "./feature-normalizer";
import { analyzeFatigue } from "@/lib/fatigue-intelligence/analyze-fatigue";
import { getMetricsByAssetId } from "@/lib/fatigue-intelligence/get-fatigue-data";

export function generateCreativeSignature(
  asset: AdsCreativeAsset,
  fatigueStatus?: FatigueStatus
): CreativeSignature {
  const normalized = normalizeCreativeAsset(asset);

  // If fatigue status not provided, try to get it from fatigue analysis
  let status: FatigueStatus = fatigueStatus || "healthy";
  
  if (!fatigueStatus) {
    const metrics = getMetricsByAssetId(asset.id);
    if (metrics.length > 0) {
      const analysis = analyzeFatigue(asset.id, metrics);
      status = analysis.status;
    }
  }

  return {
    assetId: asset.id,
    hookType: normalized.hookType,
    pacing: normalized.pacing,
    voiceType: normalized.voiceType,
    visualDensity: normalized.visualDensity,
    durationBucket: normalized.durationBucket,
    fatigueStatus: status,
  };
}

export function generateSignaturesForAssets(
  assets: AdsCreativeAsset[]
): CreativeSignature[] {
  return assets.map((asset) => generateCreativeSignature(asset));
}

export function signaturesMatch(
  sig1: CreativeSignature,
  sig2: CreativeSignature,
  strict: boolean = false
): boolean {
  if (strict) {
    return (
      sig1.hookType === sig2.hookType &&
      sig1.pacing === sig2.pacing &&
      sig1.voiceType === sig2.voiceType &&
      sig1.visualDensity === sig2.visualDensity &&
      sig1.durationBucket === sig2.durationBucket
    );
  }

  // Flexible matching: same hook + pacing + duration bucket
  return (
    sig1.hookType === sig2.hookType &&
    sig1.pacing === sig2.pacing &&
    sig1.durationBucket === sig2.durationBucket
  );
}

