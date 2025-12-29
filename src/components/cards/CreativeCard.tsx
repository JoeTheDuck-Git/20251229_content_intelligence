import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdsCreativeAsset } from "@/types/ads";
import { FatigueStatus } from "@/types/ads";
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";

interface CreativeCardProps {
  asset: AdsCreativeAsset;
  ctr: number;
  roas: number;
  spend: number;
  fatigueStatus: FatigueStatus;
}

export function CreativeCard({
  asset,
  ctr,
  roas,
  spend,
  fatigueStatus,
}: CreativeCardProps) {
  const statusConfig = {
    healthy: {
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      badge: "success" as const,
      label: "Healthy",
    },
    warning: {
      icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
      badge: "warning" as const,
      label: "Warning",
    },
    fatigued: {
      icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      badge: "destructive" as const,
      label: "Fatigued",
    },
  };

  const status = statusConfig[fatigueStatus];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{asset.platform}</CardTitle>
          <div className="flex items-center gap-2">
            {status.icon}
            <Badge variant={status.badge}>{status.label}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Duration</span>
          <span className="font-medium">{asset.duration}s</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">CTR</span>
          <span className="font-medium">{ctr.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">ROAS</span>
          <span className="font-medium">{roas.toFixed(1)}x</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Spend</span>
          <span className="font-medium">${(spend / 1000).toFixed(1)}k</span>
        </div>
        <div className="pt-2 border-t">
          <Badge variant="outline" className="mr-2">
            {asset.creativeFeatures.hookType}
          </Badge>
          <Badge variant="outline">{asset.creativeFeatures.pacing}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

