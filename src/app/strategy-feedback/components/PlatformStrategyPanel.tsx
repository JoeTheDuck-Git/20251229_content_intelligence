import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlatformStrategy, StrategyPosture } from "@/lib/strategy-engine/platform-strategy-generator";
import { AlertTriangle } from "lucide-react";
import { PlatformStrategyBadge } from "./PlatformStrategyBadge";

interface PlatformStrategyPanelProps {
  strategy: PlatformStrategy;
}

export function PlatformStrategyPanel({ strategy }: PlatformStrategyPanelProps) {
  const postureConfig: Record<
    StrategyPosture,
    { label: string; variant: "success" | "warning" | "destructive" | "secondary" }
  > = {
    scale: { label: "Scale", variant: "success" },
    maintain: { label: "Maintain", variant: "secondary" },
    test: { label: "Test", variant: "warning" },
    hold: { label: "Hold", variant: "destructive" },
  };

  const posture = postureConfig[strategy.posture];

  const fatigueConfig = {
    healthy: { label: "Healthy", variant: "success" as const },
    warning: { label: "Warning", variant: "warning" as const },
    fatigued: { label: "Fatigued", variant: "destructive" as const },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PlatformStrategyBadge platform={strategy.platform} />
            <CardTitle className="text-lg">{strategy.platform} Strategy</CardTitle>
          </div>
          <Badge variant={posture.variant}>{posture.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Strategy Posture */}
        <div>
          <p className="text-sm font-medium mb-2">Current Strategy Posture</p>
          <p className="text-sm text-muted-foreground">{strategy.reasoning}</p>
        </div>

        {/* Key Metrics */}
        {strategy.keyMetrics.avgCTR !== undefined ||
        strategy.keyMetrics.avgROAS !== undefined ||
        strategy.keyMetrics.fatigueStatus ? (
          <div>
            <p className="text-sm font-medium mb-2">Key Metrics</p>
            <div className="space-y-2 text-sm">
              {strategy.keyMetrics.avgCTR !== undefined && !isNaN(strategy.keyMetrics.avgCTR) && (
                <div className="flex items-center justify-between">
                  <span>Average CTR</span>
                  <span className="font-medium">
                    {strategy.keyMetrics.avgCTR.toFixed(1)}%
                  </span>
                </div>
              )}
              {strategy.keyMetrics.avgROAS !== undefined && !isNaN(strategy.keyMetrics.avgROAS) && (
                <div className="flex items-center justify-between">
                  <span>Average ROAS</span>
                  <span className="font-medium">
                    {strategy.keyMetrics.avgROAS.toFixed(1)}x
                  </span>
                </div>
              )}
              {strategy.keyMetrics.fatigueStatus && (
                <div className="flex items-center justify-between">
                  <span>Fatigue Status</span>
                  <Badge
                    variant={
                      fatigueConfig[strategy.keyMetrics.fatigueStatus].variant
                    }
                  >
                    {fatigueConfig[strategy.keyMetrics.fatigueStatus].label}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Watch-outs */}
        {strategy.watchOuts.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Watch-outs
            </p>
            <ul className="space-y-1">
              {strategy.watchOuts.map((watchOut, idx) => (
                <li key={idx} className="text-sm text-muted-foreground">
                  • {watchOut}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

