import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StrategyDirection } from "@/lib/content-overview/strategy-direction-generator";
import { Target } from "lucide-react";

interface DirectionSummaryPanelProps {
  direction: StrategyDirection;
}

export function DirectionSummaryPanel({ direction }: DirectionSummaryPanelProps) {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Target className="h-6 w-6" />
          Strategy Direction Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">Primary Focus</h3>
          <p className="text-base leading-relaxed">{direction.primaryFocus}</p>
        </div>

        {direction.secondaryActions.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm mb-2">Secondary Actions</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {direction.secondaryActions.map((action, idx) => (
                <li key={idx}>{action}</li>
              ))}
            </ul>
          </div>
        )}

        {direction.riskMitigation.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm mb-2 text-red-600">Risk Mitigation</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
              {direction.riskMitigation.map((risk, idx) => (
                <li key={idx}>{risk}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

