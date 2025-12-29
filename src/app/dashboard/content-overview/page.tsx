"use client";

import { useMemo } from "react";
import { InternalCapabilitySnapshot } from "./components/InternalCapabilitySnapshot";
import { MarketContextSnapshot } from "./components/MarketContextSnapshot";
import { StrategicPositioningSummary } from "./components/StrategicPositioningSummary";
import { DirectionalOutlook } from "./components/DirectionalOutlook";
import { ExecutiveConfidenceNotice } from "./components/ExecutiveConfidenceNotice";

// Strategy logic
import { classifyContentPortfolio } from "@/lib/content-overview/portfolio-classifier";
import { analyzeGrowthSignalBalance } from "@/lib/content-overview/signal-balance-analyzer";
import { detectStrategicTensions } from "@/lib/content-overview/tension-detector";
import { evaluateConfidence } from "@/lib/content-overview/confidence-evaluator";
import { generateStrategicPositioning, generateDirectionalFocus } from "@/lib/content-overview/ceo-synthesis";

// Creative performance analysis
import { analyzeCrossFormatCapability, analyzeTagPerformanceAcrossFormats } from "@/lib/creative-performance/cross-format-intelligence";
import { analyzeCrossFormatMarketContext } from "@/lib/creative-performance/market-context-intelligence";

// Demo data
import { demoAdsAssets } from "@/lib/demo-data/ads-assets";
import { demoOrganicAssets } from "@/lib/organic/demo-data/organic-assets";
import { demoCompetitorContent } from "@/lib/competitor/demo-data/competitor-content";
import { getMetricsByAssetId } from "@/lib/fatigue-intelligence/get-fatigue-data";
import { analyzeFatigue } from "@/lib/fatigue-intelligence/analyze-fatigue";
import { generateMomentumState } from "@/lib/organic/momentum-intelligence/lifecycle-classifier";
import { demoAdsPerformanceMetrics } from "@/lib/demo-data/ads-performance-metrics";
import { demoOrganicMetrics } from "@/lib/organic/demo-data/organic-metrics";

// Types
import { FatigueAnalysis } from "@/types/fatigue";
import { OrganicMomentumState } from "@/types/organic";
import { MomentAlignmentResult } from "@/types/trend";
import { MarketContextAnalysis, CompetitorSignal } from "@/types/competitor";

export default function ContentOverviewPage() {
  const ceoData = useMemo(() => {
    // Prepare data maps
    const paidMetricsMap = new Map<string, typeof demoAdsPerformanceMetrics[0][]>();
    const organicMetricsMap = new Map<string, typeof demoOrganicMetrics[0][]>();
    const fatigueDataMap = new Map<string, FatigueAnalysis>();
    const momentumDataMap = new Map<string, OrganicMomentumState>();
    const momentAlignmentsMap = new Map<string, MomentAlignmentResult[]>();

    // Process paid metrics
    demoAdsPerformanceMetrics.forEach((metric) => {
      const existing = paidMetricsMap.get(metric.assetId) || [];
      existing.push(metric);
      paidMetricsMap.set(metric.assetId, existing);
    });

    // Process organic metrics
    demoOrganicMetrics.forEach((metric) => {
      const existing = organicMetricsMap.get(metric.assetId) || [];
      existing.push(metric);
      organicMetricsMap.set(metric.assetId, existing);
    });

    // Process fatigue data
    demoAdsAssets.forEach((asset) => {
      const metrics = getMetricsByAssetId(asset.id);
      if (metrics.length > 0) {
        const fatigue = analyzeFatigue(asset.id, metrics);
        fatigueDataMap.set(asset.id, fatigue);
      }
    });

    // Process momentum data
    demoOrganicAssets.forEach((asset) => {
      const metrics = organicMetricsMap.get(asset.id) || [];
      if (metrics.length > 0) {
        const momentumState = generateMomentumState(asset, metrics);
        momentumDataMap.set(asset.id, momentumState);
      }
    });

    // Mock moment alignments
    const mockMomentAlignments: MomentAlignmentResult[] = [
      {
        assetId: "organic-001",
        momentId: "moment-001",
        alignmentStrength: "strong",
        amplificationImpact: "high",
        timingScore: 8.5,
        topicRelevanceScore: 9.0,
        estimatedUplift: 25,
      },
    ];
    mockMomentAlignments.forEach((alignment) => {
      const existing = momentAlignmentsMap.get(alignment.assetId) || [];
      existing.push(alignment);
      momentAlignmentsMap.set(alignment.assetId, existing);
    });

    // Classify portfolio
    const portfolio = classifyContentPortfolio(
      demoAdsAssets,
      demoOrganicAssets,
      paidMetricsMap,
      organicMetricsMap,
      fatigueDataMap,
      momentumDataMap,
      momentAlignmentsMap
    );

    // Analyze signal balance
    const allMomentumStates = Array.from(momentumDataMap.values());
    const allPaidMetrics = Array.from(paidMetricsMap.values()).flat();
    const allFatigueData = Array.from(fatigueDataMap.values());
    const signalBalance = analyzeGrowthSignalBalance(
      portfolio,
      allMomentumStates,
      allPaidMetrics,
      allFatigueData
    );

    // Detect tensions
    const tensions = detectStrategicTensions(
      portfolio,
      momentumDataMap,
      paidMetricsMap,
      fatigueDataMap
    );

    // Evaluate confidence
    const confidence = evaluateConfidence(
      portfolio,
      true, // hasPaidData
      true, // hasOrganicData
      true, // hasFatigueData
      true, // hasMomentumData
      true, // hasTrendData (mock)
      false // hasYouTubeData
    );

    // Analyze cross-format capability
    const crossFormatCapability = analyzeCrossFormatCapability(
      demoAdsAssets,
      demoOrganicAssets
    );

    // Analyze tag performance
    const tagPerformance = analyzeTagPerformanceAcrossFormats(
      demoAdsAssets,
      demoOrganicAssets
    );

    // Analyze market context
    const competitorSignals = analyzeCrossFormatMarketContext(
      tagPerformance,
      demoCompetitorContent
    );

    // Build market context analysis
    // Convert creative-performance CompetitorSignal to competitor CompetitorSignal
    const overrepresentedTags = competitorSignals
      .filter((s) => s.marketPresence === "overrepresented")
      .map((s) => ({
        tagType: s.tagType,
        tagName: s.tagName,
        marketPresence: s.marketPresence,
        confidence: s.confidence,
      }));
    const underrepresentedTags = competitorSignals
      .filter((s) => s.marketPresence === "underrepresented")
      .map((s) => ({
        tagType: s.tagType,
        tagName: s.tagName,
        marketPresence: s.marketPresence,
        confidence: s.confidence,
      }));

    const marketContext: MarketContextAnalysis = {
      overallAlignment:
        overrepresentedTags.length > underrepresentedTags.length
          ? "crowded"
          : underrepresentedTags.length > overrepresentedTags.length
          ? "divergent"
          : "aligned",
      overrepresentedTags,
      underrepresentedTags,
      saturationRisk:
        overrepresentedTags.length >= 5 ? "high" : overrepresentedTags.length >= 2 ? "medium" : "low",
      divergenceRisk:
        underrepresentedTags.length >= 5 ? "high" : underrepresentedTags.length >= 2 ? "medium" : "low",
    };

    // Generate strategic positioning
    const strategicPositioning = generateStrategicPositioning(
      crossFormatCapability,
      marketContext,
      portfolio,
      signalBalance
    );

    // Generate directional focus
    const directionalFocus = generateDirectionalFocus(
      crossFormatCapability,
      marketContext,
      portfolio,
      signalBalance,
      tensions
    );

    // Get top tags (sorted by confidence and strength)
    const topTags = tagPerformance
      .filter((tag) => tag.overallConfidence === "high")
      .sort((a, b) => {
        const aStrength = a.formatStrengths[0]?.strength === "strong" ? 3 : a.formatStrengths[0]?.strength === "mixed" ? 2 : 1;
        const bStrength = b.formatStrengths[0]?.strength === "strong" ? 3 : b.formatStrengths[0]?.strength === "mixed" ? 2 : 1;
        return bStrength - aStrength;
      })
      .slice(0, 5);

    // High confidence competitor signals (convert to competitor type)
    const highConfidenceSignals = competitorSignals
      .filter((s) => s.confidence === "high")
      .map((s) => ({
        tagType: s.tagType,
        tagName: s.tagName,
        marketPresence: s.marketPresence,
        confidence: s.confidence,
      }));

    return {
      crossFormatCapability,
      topTags,
      marketContext,
      highConfidenceSignals,
      strategicPositioning,
      directionalFocus,
      confidence,
    };
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">Content Overview</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Internal Capability × Market Context × Strategic Direction
        </p>
      </div>

      {/* Confidence Notice */}
      <ExecutiveConfidenceNotice confidence={ceoData.confidence} />

      {/* 1. Internal Creative Capability Snapshot */}
      <section>
        <InternalCapabilitySnapshot
          crossFormatCapability={ceoData.crossFormatCapability}
          topTags={ceoData.topTags}
        />
      </section>

      {/* 2. Market Context Snapshot */}
      <section>
        <MarketContextSnapshot
          marketContext={ceoData.marketContext}
          highConfidenceSignals={ceoData.highConfidenceSignals}
        />
      </section>

      {/* 3. Strategic Positioning Summary */}
      <section>
        <StrategicPositioningSummary
          statements={ceoData.strategicPositioning}
        />
      </section>

      {/* 4. Directional Outlook */}
      <section>
        <DirectionalOutlook focusAreas={ceoData.directionalFocus} />
      </section>

      {/* 5. Future Extension Placeholder */}
      <section>
        <div className="border border-dashed rounded-lg p-6 text-center">
          <p className="text-sm text-muted-foreground font-semibold mb-2">
            Future Extensions (Not Implemented)
          </p>
          <ul className="list-none space-y-1 text-xs text-muted-foreground">
            <li>Scenario simulation</li>
            <li>Board-level reporting</li>
            <li>Executive brief export</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
