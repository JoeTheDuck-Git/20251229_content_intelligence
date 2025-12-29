export type InsightType = "positive" | "warning" | "recommendation" | "risk";

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  assetId?: string;
  priority?: "high" | "medium" | "low";
}

export interface Recommendation {
  assetId: string;
  category: "optimization" | "scaling" | "refresh";
  title: string;
  description: string;
  actions: string[];
}

