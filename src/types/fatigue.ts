export type FatigueStatus = "healthy" | "early_warning" | "fatigued";

export interface FatigueSignal {
  id: string;
  type: "frequency_saturation" | "ctr_decay" | "roas_decline" | "spend_efficiency_drop";
  severity: "low" | "medium" | "high";
  detected: boolean;
  description: string;
}

export interface FatigueAnalysis {
  assetId: string;
  status: FatigueStatus;
  signals: FatigueSignal[];
  explanation: string;
  confidence: "high" | "medium" | "low";
  recommendedAction: "continue" | "refresh_creative" | "pause_scaling";
  metrics: {
    currentFrequency: number;
    frequencyTrend: "increasing" | "stable" | "decreasing";
    currentCTR: number;
    ctrTrend: "improving" | "stable" | "declining";
    currentROAS: number;
    roasTrend: "improving" | "stable" | "declining";
    totalSpend: number;
  };
}

export interface AdsMetric {
  assetId: string;
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  roas: number;
  frequency: number;
}

