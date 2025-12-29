import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StrategyOutput } from "@/types/strategy";
import { ConfidenceIndicator } from "./ConfidenceIndicator";

interface StrategyExplanationPanelProps {
  strategy: StrategyOutput;
}

export function StrategyExplanationPanel({ strategy }: StrategyExplanationPanelProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Strategy Explanation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {strategy.strategyExplanation}
          </p>
        </CardContent>
      </Card>

      <ConfidenceIndicator
        level={strategy.overallConfidence}
        dataCompleteness={strategy.dataCompleteness}
      />
    </div>
  );
}

