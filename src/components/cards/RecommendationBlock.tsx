import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Recommendation } from "@/types";

interface RecommendationBlockProps {
  recommendation: Recommendation;
}

export function RecommendationBlock({ recommendation }: RecommendationBlockProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Recommendations</CardTitle>
        <CardDescription>
          AI Model Plug-in (Future) - Currently using rule-based logic
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Suggested Video Length</p>
          <Badge variant="secondary">{recommendation.videoLength}s</Badge>
        </div>
        <div>
          <p className="text-sm font-medium mb-2">Suggested Hook Type</p>
          <Badge variant="secondary">{recommendation.hookType}</Badge>
        </div>
        <div>
          <p className="text-sm font-medium mb-2">Suggested Pacing</p>
          <Badge variant="secondary">{recommendation.pacing}</Badge>
        </div>
        <div>
          <p className="text-sm font-medium mb-2">Reasoning</p>
          <p className="text-sm text-muted-foreground">{recommendation.reasoning}</p>
        </div>
      </CardContent>
    </Card>
  );
}

