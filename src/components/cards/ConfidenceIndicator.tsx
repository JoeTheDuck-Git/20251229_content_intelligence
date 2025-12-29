import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfidenceLevel } from "@/types/strategy";
import { CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

interface ConfidenceIndicatorProps {
  level: ConfidenceLevel;
  dataCompleteness: {
    fatigueData: boolean;
    clusterData: boolean;
    multiChannelData: boolean;
  };
}

export function ConfidenceIndicator({
  level,
  dataCompleteness,
}: ConfidenceIndicatorProps) {
  const config = {
    high: {
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      badge: "success" as const,
      label: "High Confidence",
      description: "Strategy recommendations are based on complete data",
    },
    medium: {
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      badge: "warning" as const,
      label: "Medium Confidence",
      description: "Some data may be incomplete, use with caution",
    },
    low: {
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      badge: "destructive" as const,
      label: "Low Confidence",
      description: "Incomplete data - recommendations should be verified",
    },
  };

  const levelConfig = config[level];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          {levelConfig.icon}
          <div>
            <Badge variant={levelConfig.badge}>{levelConfig.label}</Badge>
            <p className="text-sm text-muted-foreground mt-1">
              {levelConfig.description}
            </p>
          </div>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            {dataCompleteness.fatigueData ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <span>Fatigue Data</span>
          </div>
          <div className="flex items-center gap-2">
            {dataCompleteness.clusterData ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <span>Cluster Data</span>
          </div>
          <div className="flex items-center gap-2">
            {dataCompleteness.multiChannelData ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <span>Multi-Channel Data</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

