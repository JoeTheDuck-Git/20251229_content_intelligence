import { ActionPlaybook } from "@/types/strategy";

export const actionPlaybooks: ActionPlaybook[] = [
  {
    id: "refresh-fatigued",
    title: "How to Refresh a Fatigued Creative",
    description: "Step-by-step guide to refreshing creatives showing fatigue signals",
    applicableScenarios: [
      "Fatigue status is 'fatigued'",
      "ROAS declining over multiple cycles",
      "Frequency above 4x",
    ],
    steps: [
      "Identify successful elements from current creative (hook type, pacing)",
      "Create 3-5 new variations maintaining successful elements",
      "Test new hook types while keeping proven pacing",
      "Reduce frequency by 30% during transition",
      "Monitor new variations for 1-2 weeks",
      "Scale winning variations gradually",
    ],
    expectedOutcome: "Refreshed creative maintains performance while reducing fatigue",
  },
  {
    id: "scale-cross-platform",
    title: "How to Safely Scale Cross-Platform Patterns",
    description: "Guidance for scaling creatives that perform well across multiple platforms",
    applicableScenarios: [
      "Pattern type is 'cross_platform_stable'",
      "All platforms show 'healthy' fatigue status",
      "Scale reliability is 'reliable'",
    ],
    steps: [
      "Verify performance consistency across all platforms",
      "Increase daily budget by 20-30% per platform",
      "Monitor frequency to stay below 3x on each platform",
      "Track ROAS stability weekly",
      "Set up alerts for fatigue signals",
      "Prepare refresh variations as backup",
    ],
    expectedOutcome: "Scaled budget maintains performance across all platforms",
  },
  {
    id: "split-strategy",
    title: "How to Split Creative Strategy by Channel",
    description: "Approach for managing platform-sensitive patterns with different performance",
    applicableScenarios: [
      "Pattern type is 'platform_sensitive'",
      "Different fatigue statuses across platforms",
      "Performance varies significantly by platform",
    ],
    steps: [
      "Identify which platforms are performing well vs. struggling",
      "Maintain or scale on healthy platforms",
      "Pause or refresh on fatigued platforms",
      "Create platform-specific variations",
      "Test different creative approaches per platform",
      "Monitor and adjust strategy independently per platform",
    ],
    expectedOutcome: "Optimized performance per platform with independent strategy",
  },
  {
    id: "maintain-stable",
    title: "How to Maintain Stable Performance",
    description: "Guidance for maintaining creatives with stable, healthy performance",
    applicableScenarios: [
      "Fatigue status is 'healthy' or 'warning'",
      "Scale reliability is 'moderate' or 'reliable'",
      "Performance metrics are stable",
    ],
    steps: [
      "Keep current budget level",
      "Monitor fatigue signals weekly",
      "Track key metrics (CTR, ROAS, frequency)",
      "Prepare refresh variations as backup",
      "Set up alerts for early warning signs",
      "Review performance monthly for trends",
    ],
    expectedOutcome: "Maintained stable performance with proactive monitoring",
  },
];

