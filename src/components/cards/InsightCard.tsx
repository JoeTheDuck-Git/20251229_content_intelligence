import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Insight } from "@/types/insights";
import { AlertCircle, CheckCircle2, Lightbulb, AlertTriangle } from "lucide-react";

interface InsightCardProps {
  insight: Insight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const iconMap = {
    positive: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    recommendation: <Lightbulb className="h-5 w-5 text-blue-500" />,
    risk: <AlertTriangle className="h-5 w-5 text-red-500" />,
  };

  const badgeVariantMap = {
    positive: "success" as const,
    warning: "warning" as const,
    recommendation: "default" as const,
    risk: "destructive" as const,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{insight.title}</CardTitle>
          {iconMap[insight.type]}
        </div>
        <Badge variant={badgeVariantMap[insight.type]} className="mt-2">
          {insight.type}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{insight.description}</p>
      </CardContent>
    </Card>
  );
}

