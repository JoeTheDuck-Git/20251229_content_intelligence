import { PortfolioMap } from "./portfolio-classifier";
import { AdsPerformanceMetrics } from "@/types/ads";
import { OrganicMomentumState } from "@/types/organic";
import { FatigueAnalysis } from "@/types/fatigue";

export interface StrategicTension {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  whatIsHappening: string;
  whyItMatters: string;
  whatToWatch: string;
}

/**
 * Detects strategic mismatches and tensions in the content portfolio
 */
export function detectStrategicTensions(
  portfolio: PortfolioMap,
  momentumStates: Map<string, OrganicMomentumState>,
  paidMetrics: Map<string, AdsPerformanceMetrics[]>,
  fatigueData: Map<string, FatigueAnalysis>
): StrategicTension[] {
  const tensions: StrategicTension[] = [];

  // Tension 1: Strong organic but weak paid amplification
  const strongOrganicAssets = portfolio.organicFirst.filter((asset) => {
    const momentum = momentumStates.get(asset.id);
    return momentum && momentum.velocityScore > 7;
  });

  if (strongOrganicAssets.length > portfolio.organicFirst.length * 0.5) {
    tensions.push({
      id: "tension-organic-weak-paid",
      title: "Strong Organic Signals Without Paid Amplification",
      description:
        "Multiple assets show strong organic momentum but lack effective paid amplification strategies.",
      severity: "high",
      whatIsHappening: `${strongOrganicAssets.length} assets demonstrate strong organic velocity (avg score >7) but are not being effectively amplified through paid channels.`,
      whyItMatters:
        "Organic momentum represents validated audience interest. Without paid amplification, you're leaving growth potential on the table and missing opportunities to scale proven content.",
      whatToWatch:
        "Monitor organic-first assets for sustained momentum. When velocity remains high for 7+ days, consider testing paid amplification with low initial budgets.",
    });
  }

  // Tension 2: Heavy paid reliance without organic validation
  const paidOnlyAssets = portfolio.paidFirst;
  const totalAssets =
    portfolio.organicFirst.length +
    portfolio.paidFirst.length +
    portfolio.dualUse.length +
    portfolio.momentOnly.length;

  if (paidOnlyAssets.length > totalAssets * 0.4) {
    tensions.push({
      id: "tension-paid-no-organic",
      title: "Heavy Paid Reliance Without Organic Validation",
      description:
        "Significant portion of portfolio depends on paid channels without organic performance validation.",
      severity: "medium",
      whatIsHappening: `${paidOnlyAssets.length} assets (${((paidOnlyAssets.length / totalAssets) * 100).toFixed(0)}% of portfolio) rely primarily on paid channels with limited or no organic validation.`,
      whyItMatters:
        "Paid-only strategies increase dependency on ad spend and reduce long-term content value. Organic validation helps identify content that resonates naturally with audiences.",
      whatToWatch:
        "Track fatigue rates in paid-first assets. High fatigue concentration suggests need for organic-first content development to reduce dependency.",
    });
  }

  // Tension 3: High moment dependency with low evergreen content
  const momentOnlyCount = portfolio.momentOnly.length;
  const dualUseCount = portfolio.dualUse.length;
  const evergreenRatio = dualUseCount / (momentOnlyCount + dualUseCount || 1);

  if (momentOnlyCount > 3 && evergreenRatio < 0.3) {
    tensions.push({
      id: "tension-moment-heavy",
      title: "High Moment Dependency with Low Evergreen Content",
      description:
        "Portfolio heavily weighted toward moment-driven content with insufficient evergreen, cross-platform assets.",
      severity: "medium",
      whatIsHappening: `${momentOnlyCount} assets are moment-dependent while only ${dualUseCount} assets show cross-platform stability. This creates volatility in content value.`,
      whyItMatters:
        "Moment-driven content has short lifespans and requires constant trend monitoring. Evergreen content provides stable foundation and reduces content production pressure.",
      whatToWatch:
        "Monitor moment-only asset performance decay rates. If decay accelerates, prioritize developing dual-use content patterns that work across multiple contexts.",
    });
  }

  // Tension 4: Fatigue concentration in high-performing assets
  let fatiguedHighPerformers = 0;
  for (const [assetId, metrics] of Array.from(paidMetrics.entries())) {
    if (metrics.length > 0) {
      const latest = metrics[metrics.length - 1];
      const fatigue = fatigueData.get(assetId);
      if (latest.roas > 4 && fatigue && fatigue.status === "fatigued") {
        fatiguedHighPerformers++;
      }
    }
  }

  if (fatiguedHighPerformers > 2) {
    tensions.push({
      id: "tension-fatigue-high-performers",
      title: "Fatigue in Previously High-Performing Assets",
      description:
        "Multiple assets that previously showed strong performance are now showing fatigue signals.",
      severity: "high",
      whatIsHappening: `${fatiguedHighPerformers} assets with historical ROAS >4x are now fatigued, indicating performance decline despite past success.`,
      whyItMatters:
        "Fatigue in high performers suggests over-reliance on specific creative patterns. This creates portfolio risk and reduces long-term scalability.",
      whatToWatch:
        "Track fatigue recovery rates. If assets don't recover after refresh cycles, consider diversifying creative patterns and reducing frequency caps.",
    });
  }

  return tensions;
}

