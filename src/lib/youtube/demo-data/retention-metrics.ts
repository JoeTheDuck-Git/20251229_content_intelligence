import { YouTubeRetentionMetrics } from "@/types/youtube";

export const demoRetentionMetrics: YouTubeRetentionMetrics[] = [
  // youtube-001: Strong retention with minor drop-off in setup
  {
    assetId: "youtube-001",
    totalWatchTime: 45600,
    averageWatchTime: 300,
    date: "2024-01-22",
    retentionData: [
      { second: 0, retentionRate: 100 },
      { second: 15, retentionRate: 95 },
      { second: 30, retentionRate: 88 },
      { second: 60, retentionRate: 82 },
      { second: 90, retentionRate: 78 },
      { second: 120, retentionRate: 75 },
      { second: 180, retentionRate: 72 },
      { second: 240, retentionRate: 70 },
      { second: 300, retentionRate: 68 },
      { second: 360, retentionRate: 66 },
      { second: 420, retentionRate: 65 },
      { second: 480, retentionRate: 64 },
    ],
  },
  // youtube-002: Good retention, strong payoff
  {
    assetId: "youtube-002",
    totalWatchTime: 29400,
    averageWatchTime: 245,
    date: "2024-02-06",
    retentionData: [
      { second: 0, retentionRate: 100 },
      { second: 20, retentionRate: 92 },
      { second: 40, retentionRate: 85 },
      { second: 60, retentionRate: 80 },
      { second: 90, retentionRate: 76 },
      { second: 120, retentionRate: 73 },
      { second: 180, retentionRate: 70 },
      { second: 240, retentionRate: 68 },
      { second: 270, retentionRate: 67 },
      { second: 300, retentionRate: 66 },
    ],
  },
  // youtube-003: Extended setup causes drop-off, but strong core retention
  {
    assetId: "youtube-003",
    totalWatchTime: 40800,
    averageWatchTime: 340,
    date: "2024-02-21",
    retentionData: [
      { second: 0, retentionRate: 100 },
      { second: 30, retentionRate: 88 },
      { second: 60, retentionRate: 75 },
      { second: 90, retentionRate: 65 },
      { second: 120, retentionRate: 60 },
      { second: 180, retentionRate: 58 },
      { second: 240, retentionRate: 57 },
      { second: 300, retentionRate: 56 },
      { second: 360, retentionRate: 55 },
      { second: 420, retentionRate: 54 },
      { second: 480, retentionRate: 53 },
      { second: 540, retentionRate: 52 },
      { second: 600, retentionRate: 51 },
    ],
  },
];

