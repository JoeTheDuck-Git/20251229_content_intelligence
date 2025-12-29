import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RetentionInsight } from "@/types/youtube";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface RetentionInsightPanelProps {
  insights: RetentionInsight[];
}

export function RetentionInsightPanel({ insights }: RetentionInsightPanelProps) {
  const impactIcons = {
    positive: <TrendingUp className="h-4 w-4 text-green-500" />,
    negative: <TrendingDown className="h-4 w-4 text-red-500" />,
    neutral: <Minus className="h-4 w-4 text-gray-500" />,
  };
  
  const impactColors = {
    positive: "bg-green-100 text-green-800",
    negative: "bg-red-100 text-red-800",
    neutral: "bg-gray-100 text-gray-800",
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Retention Insights by Segment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, idx) => (
          <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {impactIcons[insight.retentionImpact]}
                <h4 className="font-semibold capitalize">{insight.segmentType} Segment</h4>
              </div>
              <Badge className={impactColors[insight.retentionImpact]}>
                {insight.retentionImpact}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Avg Retention: {insight.averageRetention.toFixed(1)}%</span>
              {insight.dropOffRate !== undefined && (
                <span>Drop-off: {insight.dropOffRate.toFixed(1)}%</span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

