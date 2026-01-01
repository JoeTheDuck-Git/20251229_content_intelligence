"use client";

import { useState, useMemo } from "react";
import { TimePerspectiveSelector } from "@/components/creative-performance/TimePerspectiveSelector";
import { TimePerspective } from "@/types/creative-performance";
import { analyzeTrendSignals } from "@/lib/trend/trend-signals/trend-signal-analyzer";
import { generateTrendInterpretation } from "@/lib/trend/trend-interpretation/trend-interpretation-generator";
import { demoContentAssets } from "@/lib/demo-data/content-assets";
import { TrendSignalsPanel } from "./components/TrendSignalsPanel";
import { TrendContextExamples } from "./components/TrendContextExamples";
import { TrendInterpretationPanel } from "./components/TrendInterpretationPanel";
import { MarketContextDisclaimer } from "./components/MarketContextDisclaimer";
import { TrendStrategicInterpretationPanel } from "./components/TrendStrategicInterpretationPanel";

export default function MarketContextPage() {
  const [timePerspective, setTimePerspective] =
    useState<TimePerspective>("Recent");

  const signals = useMemo(() => {
    return analyzeTrendSignals(demoContentAssets, timePerspective);
  }, [timePerspective]);

  const interpretations = useMemo(() => {
    return generateTrendInterpretation(signals);
  }, [signals]);

  return (
    <div className="space-y-6">
      {/* Scope Declaration */}
      <div className="p-4 bg-muted/50 border border-border rounded-md">
        <p className="text-sm text-muted-foreground">
          This page presents interpreted market signals.
          It does not provide recommendations or execution guidance.
        </p>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Market Context</h1>
          <p className="text-muted-foreground">
            Interpreted market signals that provide context for strategic thinking.
          </p>
        </div>
        <TimePerspectiveSelector
          value={timePerspective}
          onChange={setTimePerspective}
        />
      </div>

      {/* Strategy Boundary Notice */}
      <MarketContextDisclaimer />

      {/* 1. Trend Signals */}
      <section>
        <TrendSignalsPanel signals={signals} timePerspective={timePerspective} />
      </section>

      {/* 2. Trend Context Examples */}
      <section>
        <TrendContextExamples assets={demoContentAssets} />
      </section>

      {/* 3. Trend Interpretation */}
      <section>
        <TrendInterpretationPanel interpretations={interpretations} />
      </section>

      {/* 4. Strategic Interpretation */}
      <section>
        <TrendStrategicInterpretationPanel signals={signals} />
      </section>
    </div>
  );
}

