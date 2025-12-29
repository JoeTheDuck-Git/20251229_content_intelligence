import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CompetitorInsight } from "@/types/competitor";
import { Lightbulb, AlertCircle, TrendingUp, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightPanelProps {
  insights: CompetitorInsight[];
}

const insightTypeIcons = {
  emphasis_shift: TrendingUp,
  narrative_change: AlertCircle,
  keyword_emergence: Lightbulb,
  visual_evolution: Eye,
};

const confidenceColors = {
  high: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  low: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

export function InsightPanel({ insights }: InsightPanelProps) {
  if (insights.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No insights available for this period.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Observational Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => {
          const Icon = insightTypeIcons[insight.type];
          return (
            <div key={insight.id} className="border-l-4 border-l-primary pl-4 py-2">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                </div>
                <Badge className={cn("text-xs", confidenceColors[insight.confidence])}>
                  {insight.confidence}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Observed: {new Date(insight.observedDate).toLocaleDateString()}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

