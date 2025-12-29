import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StrategyOutput } from "@/types/strategy";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface StrategyCardProps {
  strategy: StrategyOutput;
}

export function StrategyCard({ strategy }: StrategyCardProps) {
  const confidenceConfig = {
    high: { variant: "success" as const, icon: <CheckCircle2 className="h-4 w-4" /> },
    medium: { variant: "warning" as const, icon: <AlertCircle className="h-4 w-4" /> },
    low: { variant: "destructive" as const, icon: <AlertCircle className="h-4 w-4" /> },
  };

  const patternConfig = {
    cross_platform_stable: { label: "Cross-Platform Stable", variant: "success" as const },
    platform_sensitive: { label: "Platform Sensitive", variant: "warning" as const },
    platform_specific: { label: "Platform Specific", variant: "secondary" as const },
  };

  const confidence = confidenceConfig[strategy.overallConfidence];
  const pattern = patternConfig[strategy.context.patternType];

  return (
    <Link href={`/strategy-feedback/platform-strategy?clusterId=${strategy.clusterId}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{strategy.clusterLabel}</CardTitle>
            <div className="flex items-center gap-2">
              {confidence.icon}
              <Badge variant={confidence.variant}>
                {strategy.overallConfidence} Confidence
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant={pattern.variant}>{pattern.label}</Badge>
          </div>
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground line-clamp-2">
              {strategy.strategyExplanation}
            </p>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t">
            <span className="text-muted-foreground">Platforms</span>
            <span className="font-medium">
              {strategy.recommendations.length}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

