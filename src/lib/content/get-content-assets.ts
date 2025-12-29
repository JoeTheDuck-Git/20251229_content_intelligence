import { ContentAsset } from "@/types";
import { demoContentAssets } from "@/lib/demo-data/content-assets";

export function getContentAssets(): ContentAsset[] {
  // Future: Replace with real API call
  return demoContentAssets;
}

export function getContentAssetById(id: string): ContentAsset | undefined {
  return demoContentAssets.find((asset) => asset.id === id);
}

export function filterContentAssets(
  platform?: string,
  minDuration?: number,
  maxDuration?: number
): ContentAsset[] {
  let filtered = demoContentAssets;

  if (platform) {
    filtered = filtered.filter((asset) => asset.platform === platform);
  }

  if (minDuration !== undefined) {
    filtered = filtered.filter((asset) => asset.duration >= minDuration);
  }

  if (maxDuration !== undefined) {
    filtered = filtered.filter((asset) => asset.duration <= maxDuration);
  }

  return filtered;
}

