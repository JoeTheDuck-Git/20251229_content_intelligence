import { CompetitorContentAsset, VisualFocus } from "@/types/competitor";

export function extractVisualFocus(asset: CompetitorContentAsset): VisualFocus {
  // In real implementation, this would analyze image/video frames
  // For demo, return the stored value
  return asset.creativeSignals.visualFocus;
}

export function extractVisualSignals(assets: CompetitorContentAsset[]): {
  visualFocus: VisualFocus;
  frequency: number;
}[] {
  const focusCounts: Record<VisualFocus, number> = {
    product: 0,
    person: 0,
    scene: 0,
    text: 0,
  };

  assets.forEach((asset) => {
    focusCounts[asset.creativeSignals.visualFocus]++;
  });

  return Object.entries(focusCounts).map(([focus, frequency]) => ({
    visualFocus: focus as VisualFocus,
    frequency,
  }));
}

