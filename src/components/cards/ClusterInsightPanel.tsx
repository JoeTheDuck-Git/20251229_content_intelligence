import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClusterAnalysis } from "@/types/clustering";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, AlertCircle } from "lucide-react";

interface ClusterInsightPanelProps {
  analysis: ClusterAnalysis;
}

export function ClusterInsightPanel({ analysis }: ClusterInsightPanelProps) {
  const fatigueTotal =
    analysis.fatigueDistribution.healthy +
    analysis.fatigueDistribution.early_warning +
    analysis.fatigueDistribution.fatigued;

  const healthyPercent =
    fatigueTotal > 0
      ? ((analysis.fatigueDistribution.healthy / fatigueTotal) * 100).toFixed(0)
      : "0";

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Cluster Definition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {analysis.cluster.explanation}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {analysis.cluster.definingFeatures.map((feature, idx) => (
                <Badge key={idx} variant="outline">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fatigue Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Healthy</span>
              <span className="font-medium">
                {analysis.fatigueDistribution.healthy} ({healthyPercent}%)
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Early Warning</span>
              <span className="font-medium">
                {analysis.fatigueDistribution.early_warning}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Fatigued</span>
              <span className="font-medium">
                {analysis.fatigueDistribution.fatigued}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Average CTR</span>
              <span className="font-medium">
                {analysis.averageMetrics.avgCTR.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Average ROAS</span>
              <span className="font-medium">
                {analysis.averageMetrics.avgROAS.toFixed(1)}x
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Average Frequency</span>
              <span className="font-medium">
                {analysis.averageMetrics.avgFrequency.toFixed(1)}x
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {analysis.clusterInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Cluster Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.clusterInsights.map((insight, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Usage Guidance</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysis.cluster.usageGuidance.map((guidance, idx) => (
              <li key={idx} className="text-sm flex items-start gap-2">
                {guidance.includes("Good") ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                ) : guidance.includes("Avoid") || guidance.includes("Warning") ? (
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <span className="text-blue-500 mt-0.5">•</span>
                )}
                <span>{guidance}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

