import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendInsight } from "@/types/trend";
import { TrendingUp, Clock, Zap, Target } from "lucide-react";

interface TrendInsightPanelProps {
  insights: TrendInsight[];
}

export function TrendInsightPanel({ insights }: TrendInsightPanelProps) {
  const typeIcons = {
    moment_alignment: <Target className="h-4 w-4" />,
    timing_impact: <Clock className="h-4 w-4" />,
    contextual_amplification: <Zap className="h-4 w-4" />,
    independent_performance: <TrendingUp className="h-4 w-4" />,
  };

  const confidenceColors = {
    high: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-gray-100 text-gray-800",
  };

  if (insights.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trend Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.id} className="border-l-4 border-purple-500 pl-4 py-2">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {typeIcons[insight.type]}
                <h4 className="font-semibold">{insight.title}</h4>
              </div>
              <Badge className={confidenceColors[insight.confidence]}>
                {insight.confidence} confidence
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{insight.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

