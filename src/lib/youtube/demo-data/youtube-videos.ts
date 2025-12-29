import { YouTubeVideoAsset } from "@/types/youtube";

export const demoYouTubeVideos: YouTubeVideoAsset[] = [
  {
    id: "youtube-001",
    title: "Deep Dive: Content Strategy",
    duration: 480,
    publishDate: "2024-01-20",
    narrativeSegments: [
      {
        segmentType: "hook",
        startSecond: 0,
        endSecond: 15,
        description: "Opening question and value proposition",
      },
      {
        segmentType: "setup",
        startSecond: 15,
        endSecond: 90,
        description: "Context setting and problem definition",
      },
      {
        segmentType: "core",
        startSecond: 90,
        endSecond: 420,
        description: "Main content and strategy breakdown",
      },
      {
        segmentType: "payoff",
        startSecond: 420,
        endSecond: 480,
        description: "Summary and call-to-action",
      },
    ],
  },
  {
    id: "youtube-002",
    title: "How to Solve X Problem",
    duration: 300,
    publishDate: "2024-02-05",
    narrativeSegments: [
      {
        segmentType: "hook",
        startSecond: 0,
        endSecond: 20,
        description: "Problem statement hook",
      },
      {
        segmentType: "setup",
        startSecond: 20,
        endSecond: 60,
        description: "Problem context and examples",
      },
      {
        segmentType: "core",
        startSecond: 60,
        endSecond: 270,
        description: "Step-by-step solution walkthrough",
      },
      {
        segmentType: "payoff",
        startSecond: 270,
        endSecond: 300,
        description: "Results and next steps",
      },
    ],
  },
  {
    id: "youtube-003",
    title: "Complete Guide Tutorial",
    duration: 600,
    publishDate: "2024-02-20",
    narrativeSegments: [
      {
        segmentType: "hook",
        startSecond: 0,
        endSecond: 30,
        description: "Comprehensive guide preview",
      },
      {
        segmentType: "setup",
        startSecond: 30,
        endSecond: 120,
        description: "Prerequisites and overview",
      },
      {
        segmentType: "core",
        startSecond: 120,
        endSecond: 540,
        description: "Detailed tutorial sections",
      },
      {
        segmentType: "payoff",
        startSecond: 540,
        endSecond: 600,
        description: "Summary and resources",
      },
    ],
  },
];

