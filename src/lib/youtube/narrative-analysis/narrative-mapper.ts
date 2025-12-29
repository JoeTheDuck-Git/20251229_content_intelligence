import { YouTubeVideoAsset, YouTubeNarrativeSegment } from "@/types/youtube";

export interface NarrativeStructure {
  assetId: string;
  segments: YouTubeNarrativeSegment[];
  segmentDurations: Record<NarrativeSegmentType, number>;
  pacingScore: number; // 0-10
}

export type NarrativeSegmentType = "hook" | "setup" | "core" | "payoff";

export function mapNarrativeStructure(
  video: YouTubeVideoAsset
): NarrativeStructure {
  const segments = video.narrativeSegments;
  
  // Calculate segment durations
  const segmentDurations: Record<NarrativeSegmentType, number> = {
    hook: 0,
    setup: 0,
    core: 0,
    payoff: 0,
  };
  
  segments.forEach(segment => {
    const duration = segment.endSecond - segment.startSecond;
    segmentDurations[segment.segmentType] += duration;
  });
  
  // Calculate pacing score
  // Ideal: hook < 5%, setup < 20%, core > 60%, payoff < 15%
  const totalDuration = video.duration;
  const hookRatio = segmentDurations.hook / totalDuration;
  const setupRatio = segmentDurations.setup / totalDuration;
  const coreRatio = segmentDurations.core / totalDuration;
  const payoffRatio = segmentDurations.payoff / totalDuration;
  
  let pacingScore = 10;
  
  // Penalize if hook is too long
  if (hookRatio > 0.1) {
    pacingScore -= 2;
  }
  
  // Penalize if setup is too long
  if (setupRatio > 0.25) {
    pacingScore -= 3;
  }
  
  // Reward if core is substantial
  if (coreRatio < 0.5) {
    pacingScore -= 2;
  }
  
  // Penalize if payoff is too long
  if (payoffRatio > 0.2) {
    pacingScore -= 1;
  }
  
  pacingScore = Math.max(0, Math.min(10, pacingScore));
  
  return {
    assetId: video.id,
    segments,
    segmentDurations,
    pacingScore,
  };
}

