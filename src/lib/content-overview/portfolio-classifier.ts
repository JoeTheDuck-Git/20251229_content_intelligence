import { AdsCreativeAsset } from "@/types/ads";
import { OrganicContentAsset } from "@/types/organic";
import { AdsPerformanceMetrics } from "@/types/ads";
import { OrganicPerformanceMetrics, OrganicMomentumState } from "@/types/organic";
import { FatigueAnalysis } from "@/types/fatigue";
import { MomentAlignmentResult } from "@/types/trend";

export type PortfolioCategory = "organic-first" | "paid-first" | "dual-use" | "moment-only";

export interface ClassifiedAsset {
  id: string;
  category: PortfolioCategory;
  confidence: "high" | "medium" | "low";
  reasoning: string;
}

export interface PortfolioMap {
  organicFirst: ClassifiedAsset[];
  paidFirst: ClassifiedAsset[];
  dualUse: ClassifiedAsset[];
  momentOnly: ClassifiedAsset[];
}

/**
 * Classifies content assets into strategic portfolio buckets
 * Rule-based classification combining paid and organic signals
 */
export function classifyContentPortfolio(
  paidAssets: AdsCreativeAsset[],
  organicAssets: OrganicContentAsset[],
  paidMetrics: Map<string, AdsPerformanceMetrics[]>,
  organicMetrics: Map<string, OrganicPerformanceMetrics[]>,
  fatigueData: Map<string, FatigueAnalysis>,
  momentumData: Map<string, OrganicMomentumState>,
  momentAlignments: Map<string, MomentAlignmentResult[]>
): PortfolioMap {
  const classified: ClassifiedAsset[] = [];
  const allAssetIds = new Set([
    ...paidAssets.map((a) => a.id),
    ...organicAssets.map((a) => a.id),
  ]);

  for (const assetId of Array.from(allAssetIds)) {
    const paidAsset = paidAssets.find((a) => a.id === assetId);
    const organicAsset = organicAssets.find((a) => a.id === assetId);
    const paidMetricHistory = paidMetrics.get(assetId) || [];
    const organicMetricHistory = organicMetrics.get(assetId) || [];
    const fatigue = fatigueData.get(assetId);
    const momentum = momentumData.get(assetId);
    const momentAlignment = momentAlignments.get(assetId) || [];

    const classification = classifySingleAsset(
      paidAsset,
      organicAsset,
      paidMetricHistory,
      organicMetricHistory,
      fatigue,
      momentum,
      momentAlignment
    );

    classified.push({
      id: assetId,
      ...classification,
    });
  }

  return {
    organicFirst: classified.filter((c) => c.category === "organic-first"),
    paidFirst: classified.filter((c) => c.category === "paid-first"),
    dualUse: classified.filter((c) => c.category === "dual-use"),
    momentOnly: classified.filter((c) => c.category === "moment-only"),
  };
}

function classifySingleAsset(
  paidAsset: AdsCreativeAsset | undefined,
  organicAsset: OrganicContentAsset | undefined,
  paidMetrics: AdsPerformanceMetrics[],
  organicMetrics: OrganicPerformanceMetrics[],
  fatigue: FatigueAnalysis | undefined,
  momentum: OrganicMomentumState | undefined,
  momentAlignments: MomentAlignmentResult[]
): {
  category: PortfolioCategory;
  confidence: "high" | "medium" | "low";
  reasoning: string;
} {
  const hasPaid = !!paidAsset && paidMetrics.length > 0;
  const hasOrganic = !!organicAsset && organicMetrics.length > 0;
  const hasStrongMomentAlignment = momentAlignments.some(
    (m) => m.alignmentStrength === "strong" && m.amplificationImpact === "high"
  );

  // Moment-only: Strong moment alignment with weak or no paid/organic signals
  if (hasStrongMomentAlignment && (!hasPaid || !hasOrganic)) {
    return {
      category: "moment-only",
      confidence: hasPaid || hasOrganic ? "medium" : "high",
      reasoning: "Strong moment alignment detected with limited paid or organic performance history.",
    };
  }

  // Organic-first: Strong organic momentum, weak or no paid performance
  if (hasOrganic && momentum) {
    const strongOrganicSignal =
      momentum.momentumType === "viral_candidate" ||
      momentum.momentumType === "steady_growth" ||
      momentum.velocityScore > 7;

    if (strongOrganicSignal && (!hasPaid || (fatigue && fatigue.status === "fatigued"))) {
      return {
        category: "organic-first",
        confidence: hasPaid ? "medium" : "high",
        reasoning: `Strong organic momentum (${momentum.momentumType}) with ${hasPaid ? "fatigued paid performance" : "no paid amplification"}.`,
      };
    }
  }

  // Paid-first: Strong paid performance, weak or no organic signals
  if (hasPaid && paidMetrics.length > 0) {
    const latestPaid = paidMetrics[paidMetrics.length - 1];
    const strongPaidSignal = latestPaid.roas > 4 && latestPaid.ctr > 5;
    const weakOrganic = !hasOrganic || (momentum && momentum.velocityScore < 4);

    if (strongPaidSignal && weakOrganic) {
      return {
        category: "paid-first",
        confidence: hasOrganic ? "medium" : "high",
        reasoning: `Strong paid performance (ROAS ${latestPaid.roas.toFixed(1)}x) with ${hasOrganic ? "weak organic momentum" : "no organic validation"}.`,
      };
    }
  }

  // Dual-use: Both paid and organic signals present and healthy
  if (hasPaid && hasOrganic) {
    const latestPaid = paidMetrics[paidMetrics.length - 1];
    const paidHealthy = !fatigue || fatigue.status !== "fatigued";
    const organicHealthy = momentum && momentum.velocityScore > 5;

    if (paidHealthy && organicHealthy) {
      return {
        category: "dual-use",
        confidence: "high",
        reasoning: "Strong performance in both paid and organic channels with healthy signals.",
      };
    }
  }

  // Default classification based on available data
  if (hasOrganic && !hasPaid) {
    return {
      category: "organic-first",
      confidence: "medium",
      reasoning: "Organic data available but no paid performance history.",
    };
  }

  if (hasPaid && !hasOrganic) {
    return {
      category: "paid-first",
      confidence: "medium",
      reasoning: "Paid data available but no organic performance history.",
    };
  }

  // Fallback
  return {
    category: "organic-first",
    confidence: "low",
    reasoning: "Limited data available for classification.",
  };
}

