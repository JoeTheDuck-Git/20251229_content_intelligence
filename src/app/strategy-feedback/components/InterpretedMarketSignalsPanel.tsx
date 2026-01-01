"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendStrategicInterpretation } from "@/types/trend";
import { InterpretedMarketSignalCard } from "./InterpretedMarketSignalCard";

interface InterpretedMarketSignalsPanelProps {
  interpretations: TrendStrategicInterpretation[];
}

export function InterpretedMarketSignalsPanel({
  interpretations,
}: InterpretedMarketSignalsPanelProps) {
  if (interpretations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {interpretations.map((interpretation) => (
        <InterpretedMarketSignalCard
          key={interpretation.id}
          interpretation={interpretation}
        />
      ))}
      
      {/* Transparency Notice */}
      <Card className="border-amber-200 bg-amber-50/30">
        <CardContent className="pt-4">
          <p className="text-xs text-amber-800 italic">
            Interpreted market signals provide contextual awareness.
            Strategy recommendations remain grounded in internal performance intelligence.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

