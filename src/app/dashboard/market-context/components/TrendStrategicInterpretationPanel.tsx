"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendSignal } from "@/types/trend";
import { TrendStrategicInterpretation } from "@/types/trend";
import { generateStrategicInterpretation } from "@/lib/trend/trend-strategic-interpretation/strategic-interpretation-generator";
import { TrendStrategicInterpretationCard } from "./TrendStrategicInterpretationCard";

interface TrendStrategicInterpretationPanelProps {
  signals: TrendSignal[];
}

export function TrendStrategicInterpretationPanel({
  signals,
}: TrendStrategicInterpretationPanelProps) {
  const interpretations: TrendStrategicInterpretation[] = signals.map((signal) =>
    generateStrategicInterpretation(signal)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Strategic Interpretation</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Interpretive analysis of trend signals for strategic context. This
          provides interpretation only, not recommendations or execution
          guidance. For actionable strategies, refer to the Strategy Feedback
          section.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {interpretations.map((interpretation) => (
          <TrendStrategicInterpretationCard
            key={interpretation.id}
            interpretation={interpretation}
          />
        ))}
      </CardContent>
    </Card>
  );
}

