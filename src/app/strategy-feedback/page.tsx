"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Strategy Engine
import { clusterCreatives } from "@/lib/creative-clustering/cluster-creatives";
import { generateStrategyForAllClusters } from "@/lib/strategy-engine/strategy-engine";
import { generateNextBestActions } from "@/lib/strategy-engine/next-best-actions";
import { generatePlatformStrategies } from "@/lib/strategy-engine/platform-strategy-generator";
import { actionPlaybooks } from "@/lib/strategy-engine/action-playbooks";

// Content Overview Logic (for combining Paid + Organic)
import { classifyContentPortfolio } from "@/lib/content-overview/portfolio-classifier";
import { analyzeGrowthSignalBalance } from "@/lib/content-overview/signal-balance-analyzer";
import { detectStrategicTensions } from "@/lib/content-overview/tension-detector";
import { evaluateConfidence } from "@/lib/content-overview/confidence-evaluator";

// Demo Data
import { demoAdsAssets } from "@/lib/demo-data/ads-assets";
import { demoOrganicAssets } from "@/lib/organic/demo-data/organic-assets";
import { demoAdsPerformanceMetrics } from "@/lib/demo-data/ads-performance-metrics";
import { demoOrganicMetrics } from "@/lib/organic/demo-data/organic-metrics";
import { getMetricsByAssetId } from "@/lib/fatigue-intelligence/get-fatigue-data";
import { analyzeFatigue } from "@/lib/fatigue-intelligence/analyze-fatigue";
import { generateMomentumState } from "@/lib/organic/momentum-intelligence/lifecycle-classifier";

// Types
import { FatigueAnalysis } from "@/types/fatigue";
import { OrganicMomentumState } from "@/types/organic";
import { MomentAlignmentResult } from "@/types/trend";
import { TrendStrategicInterpretation } from "@/types/trend";
import { TimePerspective } from "@/types/creative-performance";

// Market Context Integration (Interpreted Signals)
// Data flow: Trend Intelligence (Observation) → Market Context (Interpretation) → Strategy Feedback
import { analyzeTrendSignals } from "@/lib/trend/trend-signals/trend-signal-analyzer";
import { generateStrategicInterpretation } from "@/lib/trend/trend-strategic-interpretation/strategic-interpretation-generator";
import { demoContentAssets } from "@/lib/demo-data/content-assets";

// Components
import { StrategyContextPanel } from "./components/StrategyContextPanel";
import { StrategyActionCard } from "./components/StrategyActionCard";
import { PlatformStrategyPanel } from "./components/PlatformStrategyPanel";
import { PlaybookCard } from "@/components/cards/PlaybookCard";
import { RiskNotice } from "./components/RiskNotice";
import { MarketRiskNotice } from "./components/MarketRiskNotice";
import { ContextualConfidencePanel } from "./components/ContextualConfidencePanel";
import { InterpretedMarketSignalsPanel } from "./components/InterpretedMarketSignalsPanel";

// Market Context Analysis
import { analyzeMarketContext, getActionMarketContext } from "@/lib/strategy-engine/market-context-analyzer";

export default function StrategyFeedbackPage() {
  const strategyData = useMemo(() => {
    // Prepare data maps (same as content-overview)
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

    // Generate strategy outputs from clusters
    const clusters = clusterCreatives(demoAdsAssets);
    const strategies = generateStrategyForAllClusters(clusters);

    // Classify portfolio (combines Paid + Organic)
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

    // Generate next best actions (combines all intelligence)
    const nextBestActions = generateNextBestActions(
      strategies,
      portfolio,
      signalBalance,
      tensions
    );

    // Generate platform strategies
    const platformStrategies = generatePlatformStrategies(strategies);

    // Evaluate confidence
    const confidence = evaluateConfidence(
      portfolio,
      true, // hasPaidData
      true, // hasOrganicData
      true, // hasFatigueData
      true, // hasMomentumData
      true, // hasTrendData
      false // hasYouTubeData
    );

    // Aggregate data completeness from strategies
    const dataCompleteness = {
      fatigueData: strategies.some((s) => s.dataCompleteness.fatigueData),
      clusterData: strategies.some((s) => s.dataCompleteness.clusterData),
      multiChannelData: strategies.some((s) => s.dataCompleteness.multiChannelData),
    };

    // Generate market context analysis
    const marketAnalysis = analyzeMarketContext(
      strategies,
      nextBestActions
    );

    // Calculate internal signal strength (mock calculation)
    const internalSignalStrength = 
      confidence.overall === "high" ? 85 :
      confidence.overall === "medium" ? 65 : 45;

    // Calculate data completeness score
    const completenessCount = [
      dataCompleteness.fatigueData,
      dataCompleteness.clusterData,
      dataCompleteness.multiChannelData,
    ].filter(Boolean).length;
    const dataCompletenessScore = (completenessCount / 3) * 100;

    return {
      strategies,
      portfolio,
      signalBalance,
      tensions,
      nextBestActions,
      platformStrategies,
      confidence,
      dataCompleteness,
      marketAnalysis,
      internalSignalStrength,
      dataCompletenessScore,
    };
  }, []);

  // Generate interpreted market signals from market context
  // Data flow: Trend Intelligence (Observation) → Market Context (Interpretation) → Strategy Feedback
  const interpretedMarketSignals = useMemo(() => {
    // Get trend signals (using Recent perspective for strategy context)
    const trendSignals = analyzeTrendSignals(demoContentAssets, "Recent" as TimePerspective);
    
    // Convert to strategic interpretations (interpretation layer)
    // Raw trend data MUST NOT be displayed on /strategy-feedback
    const interpretations: TrendStrategicInterpretation[] = trendSignals.map((signal) =>
      generateStrategicInterpretation(signal)
    );
    
    return interpretations;
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">Strategy Feedback</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Decision-making layer: Convert Paid and Organic Intelligence into clear, platform-aware
          next best actions.
        </p>
      </div>

      {/* Confidence & Uncertainty Disclosure */}
      <RiskNotice
        dataCompleteness={strategyData.dataCompleteness}
        signalConsistency={strategyData.confidence.signalConsistency}
        warnings={strategyData.confidence.warnings}
        overallConfidence={strategyData.confidence.overall}
        marketAnalysis={strategyData.marketAnalysis}
      />

      {/* 1. Strategy Context Snapshot */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Strategy Context Snapshot</h2>
        <p className="text-muted-foreground mb-6">
          Immediate clarity on why recommendations exist. Summary only — no deep metrics or charts.
        </p>
        <StrategyContextPanel
          strategies={strategyData.strategies}
          portfolio={strategyData.portfolio}
          signalBalance={strategyData.signalBalance}
          marketAnalysis={strategyData.marketAnalysis}
        />
      </section>

      {/* 2. Next Best Actions (CORE) */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Next Best Actions</h2>
        <p className="text-muted-foreground mb-6">
          Clear, prioritized actions based on combined Paid and Organic Intelligence. Each action
          includes target platform, affected clusters, rationale, and confidence level.
        </p>
        {strategyData.nextBestActions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                No actions identified at this time. Continue monitoring performance.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {strategyData.nextBestActions.map((action) => {
              const marketContext = getActionMarketContext(
                action,
                strategyData.marketAnalysis
              );
              return (
                <StrategyActionCard
                  key={action.id}
                  action={action}
                  marketContext={marketContext}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Market Context Check */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Market Context Check</h2>
        <p className="text-muted-foreground mb-6">
          Market context reflects observed competitor usage patterns. This section summarizes market saturation and differentiation opportunities.
        </p>
        <MarketRiskNotice marketAnalysis={strategyData.marketAnalysis} />
      </section>

      {/* 3.5. Interpreted Market Signals */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Interpreted Market Signals</h2>
        <p className="text-muted-foreground mb-6">
          Observed market patterns translated into strategic considerations.
          These signals inform context, not decisions.
        </p>
        <InterpretedMarketSignalsPanel interpretations={interpretedMarketSignals} />
      </section>

      {/* 4. Contextual Confidence Panel */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Confidence & Risk Assessment</h2>
        <p className="text-muted-foreground mb-6">
          Comprehensive confidence evaluation including internal signal strength, data completeness, and market context factors.
        </p>
        <ContextualConfidencePanel
          internalConfidence={strategyData.confidence.overall}
          marketAnalysis={strategyData.marketAnalysis}
          internalSignalStrength={strategyData.internalSignalStrength}
          dataCompleteness={strategyData.dataCompletenessScore}
        />
      </section>

      {/* 5. Platform-Specific Strategy Panel */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Platform-Specific Strategy</h2>
        <p className="text-muted-foreground mb-6">
          Avoid one-size-fits-all strategy. Current posture, key reasoning, and watch-outs for each
          platform.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {strategyData.platformStrategies.map((strategy) => (
            <PlatformStrategyPanel key={strategy.platform} strategy={strategy} />
          ))}
        </div>
      </section>

      {/* 6. Strategy Playbooks */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Strategy Playbooks</h2>
        <p className="text-muted-foreground mb-6">
          Decision support: Learn how to think, not just what to do. Each playbook includes when to
          use, signals that trigger it, and expected outcome.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {actionPlaybooks.map((playbook) => (
            <PlaybookCard key={playbook.id} playbook={playbook} />
          ))}
        </div>
      </section>

      {/* Future Extension Placeholder */}
      <section>
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-lg text-muted-foreground">
              Future Extensions (Not Implemented)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Agent-driven execution</li>
              <li>Budget orchestration</li>
              <li>Automated creative routing</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

