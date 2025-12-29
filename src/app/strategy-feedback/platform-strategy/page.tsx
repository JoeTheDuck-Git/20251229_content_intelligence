"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { clusterCreatives } from "@/lib/creative-clustering/cluster-creatives";
import { generateStrategyOutput } from "@/lib/strategy-engine/strategy-engine";
import { demoAdsAssets } from "@/lib/demo-data/ads-assets";
import { StrategyOutput } from "@/types/strategy";
import { StrategyExplanationPanel } from "@/components/cards/StrategyExplanationPanel";
import { PlatformActionBadge } from "@/components/cards/PlatformActionBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

export default function PlatformStrategyPage() {
  const searchParams = useSearchParams();
  const clusterId = searchParams.get("clusterId") || "";
  const [strategy, setStrategy] = useState<StrategyOutput | null>(null);

  useEffect(() => {
    if (clusterId) {
      const clusters = clusterCreatives(demoAdsAssets);
      const foundCluster = clusters.find((c) => c.clusterId === clusterId);
      
      if (foundCluster) {
        const strategyOutput = generateStrategyOutput(foundCluster);
        setStrategy(strategyOutput);
      }
    }
  }, [clusterId]);

  if (!strategy) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Strategy not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{strategy.clusterLabel}</h1>
        <p className="text-muted-foreground mt-2">
          Platform-specific strategy recommendations
        </p>
      </div>

      <StrategyExplanationPanel strategy={strategy} />

      <div>
        <h2 className="text-2xl font-bold mb-4">Platform Recommendations</h2>
        <div className="space-y-4">
          {strategy.recommendations.map((rec) => (
            <Card key={rec.platform}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{rec.platform}</CardTitle>
                  <div className="flex items-center gap-2">
                    <PlatformActionBadge action={rec.recommendedAction} />
                    <Badge variant="outline">{rec.confidenceLevel} Confidence</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Rationale</p>
                  <p className="text-sm text-muted-foreground">{rec.rationale}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Creative Guidance</p>
                  <ul className="space-y-1">
                    {rec.creativeGuidance.map((guidance, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{guidance}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Traceable Intelligence</p>
                  <div className="flex flex-wrap gap-2">
                    {rec.traceableIntelligence.map((trace, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {trace}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

