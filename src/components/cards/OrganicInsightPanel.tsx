import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrganicInsight } from "@/types/organic";
import { Lightbulb, TrendingUp, Target, Clock } from "lucide-react";

interface OrganicInsightPanelProps {
  insights: OrganicInsight[];
}

export function OrganicInsightPanel({ insights }: OrganicInsightPanelProps) {
  const typeIcons = {
    momentum: <TrendingUp className="h-4 w-4" />,
    platform_fit: <Target className="h-4 w-4" />,
    creative_signal: <Lightbulb className="h-4 w-4" />,
    timing: <Clock className="h-4 w-4" />,
  };

  const confidenceColors = {
    high: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-gray-100 text-gray-800",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organic Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.id} className="border-l-4 border-blue-500 pl-4 py-2">
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

