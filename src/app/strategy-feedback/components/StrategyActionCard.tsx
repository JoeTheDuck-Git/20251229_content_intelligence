import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NextBestAction } from "@/lib/strategy-engine/next-best-actions";
import { AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import { PlatformStrategyBadge } from "./PlatformStrategyBadge";
import { MarketContextBadge } from "./MarketContextBadge";

interface StrategyActionCardProps {
  action: NextBestAction;
  marketContext?: "Crowded Market" | "Differentiated" | "Market Neutral" | null;
}

export function StrategyActionCard({ action, marketContext }: StrategyActionCardProps) {
  const confidenceConfig = {
    high: {
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      variant: "success" as const,
    },
    medium: {
      icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
      variant: "warning" as const,
    },
    low: {
      icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      variant: "destructive" as const,
    },
  };

  const priorityConfig = {
    high: "destructive" as const,
    medium: "warning" as const,
    low: "secondary" as const,
  };

  const confidence = confidenceConfig[action.confidenceLevel];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg leading-tight">{action.title}</CardTitle>
          <div className="flex items-center gap-2 flex-shrink-0">
            {confidence.icon}
            <Badge variant={confidence.variant}>
              {action.confidenceLevel} confidence
            </Badge>
          </div>
        </div>
        {/* Market Context Badge - optional, does not affect priority */}
        {marketContext && (
          <div className="mt-2">
            <MarketContextBadge context={marketContext} />
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Target Platforms */}
        <div>
          <p className="text-sm font-medium mb-2">Target Platform(s)</p>
          <div className="flex flex-wrap gap-2">
            {action.targetPlatforms.map((platform) => (
              <PlatformStrategyBadge key={platform} platform={platform} />
            ))}
          </div>
        </div>

        {/* Affected Clusters */}
        {action.affectedClusters.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Affected Cluster(s)</p>
            <div className="flex flex-wrap gap-2">
              {action.affectedClusters.map((clusterId) => (
                <Badge key={clusterId} variant="outline" className="text-xs">
                  {clusterId}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Rationale */}
        <div>
          <p className="text-sm font-medium mb-2">Why</p>
          <p className="text-sm text-muted-foreground">{action.rationale}</p>
        </div>

        {/* Risk Note */}
        {action.riskNote && (
          <div className="pt-2 border-t">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium mb-1">Risk Note</p>
                <p className="text-sm text-muted-foreground">{action.riskNote}</p>
              </div>
            </div>
          </div>
        )}

        {/* Priority Badge */}
        <div className="pt-2 border-t">
          <Badge variant={priorityConfig[action.priority]}>
            {action.priority} priority
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

