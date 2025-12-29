import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Recommendation } from "@/types/insights";
import { CheckCircle2 } from "lucide-react";

interface RecommendationPanelProps {
  recommendations: Recommendation[];
}

export function RecommendationPanel({
  recommendations,
}: RecommendationPanelProps) {
  return (
    <div className="space-y-4">
      {recommendations.map((rec) => (
        <Card key={rec.assetId}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{rec.title}</CardTitle>
              <Badge variant="outline">{rec.category}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {rec.description}
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium">Actions:</p>
              <ul className="space-y-1">
                {rec.actions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

