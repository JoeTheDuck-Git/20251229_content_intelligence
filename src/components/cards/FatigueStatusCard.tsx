import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FatigueStatus } from "@/types/fatigue";
import { CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

interface FatigueStatusCardProps {
  assetId: string;
  status: FatigueStatus;
  ctr: number;
  roas: number;
  frequency: number;
  spend: number;
}

export function FatigueStatusCard({
  assetId,
  status,
  ctr,
  roas,
  frequency,
  spend,
}: FatigueStatusCardProps) {
  const statusConfig = {
    healthy: {
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      badge: "success" as const,
      label: "Healthy",
      color: "text-green-600",
    },
    early_warning: {
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      badge: "warning" as const,
      label: "Early Warning",
      color: "text-yellow-600",
    },
    fatigued: {
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      badge: "destructive" as const,
      label: "Fatigued",
      color: "text-red-600",
    },
  };

  const config = statusConfig[status];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Creative {assetId}</CardTitle>
          <div className="flex items-center gap-2">
            {config.icon}
            <Badge variant={config.badge}>{config.label}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">CTR</span>
          <span className="font-medium">{ctr.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">ROAS</span>
          <span className="font-medium">{roas.toFixed(1)}x</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Frequency</span>
          <span className="font-medium">{frequency.toFixed(1)}x</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Spend</span>
          <span className="font-medium">${(spend / 1000).toFixed(1)}k</span>
        </div>
      </CardContent>
    </Card>
  );
}

