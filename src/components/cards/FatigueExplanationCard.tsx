import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FatigueAnalysis } from "@/types/fatigue";
import { Badge } from "@/components/ui/badge";

interface FatigueExplanationCardProps {
  analysis: FatigueAnalysis;
}

export function FatigueExplanationCard({ analysis }: FatigueExplanationCardProps) {
  const actionColors = {
    continue: "bg-green-50 border-green-200",
    refresh_creative: "bg-red-50 border-red-200",
    pause_scaling: "bg-yellow-50 border-yellow-200",
  };

  const actionLabels = {
    continue: "Continue Spending",
    refresh_creative: "Refresh Creative",
    pause_scaling: "Pause Scaling",
  };

  return (
    <Card className={actionColors[analysis.recommendedAction]}>
      <CardHeader>
        <CardTitle>Fatigue Analysis</CardTitle>
        <div className="flex gap-2 mt-2">
          <Badge variant="outline">Confidence: {analysis.confidence}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Explanation</p>
          <p className="text-sm text-muted-foreground">{analysis.explanation}</p>
        </div>
        <div>
          <p className="text-sm font-medium mb-2">Recommended Action</p>
          <Badge variant="secondary" className="text-sm">
            {actionLabels[analysis.recommendedAction]}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

