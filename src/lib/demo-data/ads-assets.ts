import { AdsCreativeAsset } from "@/types/ads";

export const demoAdsAssets: AdsCreativeAsset[] = [
  {
    id: "ads-001",
    platform: "Meta",
    format: "video",
    duration: 15,
    creativeFeatures: {
      hookType: "Question Hook",
      pacing: "fast",
      voiceType: "talking-head",
      visualDensity: "high",
    },
    createdAt: "2024-01-10",
  },
  {
    id: "ads-002",
    platform: "Meta",
    format: "video",
    duration: 30,
    creativeFeatures: {
      hookType: "Problem-Solution",
      pacing: "medium",
      voiceType: "voiceover",
      visualDensity: "medium",
    },
    createdAt: "2024-01-15",
  },
  {
    id: "ads-003",
    platform: "YouTube",
    format: "video",
    duration: 60,
    creativeFeatures: {
      hookType: "Story Hook",
      pacing: "slow",
      voiceType: "voiceover",
      visualDensity: "low",
    },
    createdAt: "2024-01-20",
  },
  {
    id: "ads-004",
    platform: "TikTok",
    format: "video",
    duration: 30,
    creativeFeatures: {
      hookType: "Shock Value",
      pacing: "fast",
      voiceType: "text-only",
      visualDensity: "high",
    },
    createdAt: "2024-01-25",
  },
  {
    id: "ads-005",
    platform: "Meta",
    format: "video",
    duration: 20,
    creativeFeatures: {
      hookType: "Question Hook",
      pacing: "fast",
      voiceType: "talking-head",
      visualDensity: "medium",
    },
    createdAt: "2024-02-01",
  },
  {
    id: "ads-006",
    platform: "YouTube",
    format: "video",
    duration: 45,
    creativeFeatures: {
      hookType: "Problem-Solution",
      pacing: "medium",
      voiceType: "voiceover",
      visualDensity: "high",
    },
    createdAt: "2024-02-05",
  },
];

