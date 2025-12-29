import { Badge } from "@/components/ui/badge";
import { RecommendedAction } from "@/types/strategy";
import { TrendingUp, Pause, RefreshCw, Activity } from "lucide-react";

interface PlatformActionBadgeProps {
  action: RecommendedAction;
}

export function PlatformActionBadge({ action }: PlatformActionBadgeProps) {
  const config = {
    scale: {
      variant: "success" as const,
      label: "Scale",
      icon: <TrendingUp className="h-3 w-3" />,
    },
    maintain: {
      variant: "secondary" as const,
      label: "Maintain",
      icon: <Activity className="h-3 w-3" />,
    },
    refresh_creative: {
      variant: "warning" as const,
      label: "Refresh Creative",
      icon: <RefreshCw className="h-3 w-3" />,
    },
    pause: {
      variant: "destructive" as const,
      label: "Pause",
      icon: <Pause className="h-3 w-3" />,
    },
  };

  const actionConfig = config[action];

  return (
    <Badge variant={actionConfig.variant} className="flex items-center gap-1">
      {actionConfig.icon}
      {actionConfig.label}
    </Badge>
  );
}

