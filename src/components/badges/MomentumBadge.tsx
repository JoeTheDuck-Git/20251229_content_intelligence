import { Badge } from "@/components/ui/badge";
import { MomentumType } from "@/types/organic";
import { TrendingUp, TrendingDown, Zap, Activity } from "lucide-react";

interface MomentumBadgeProps {
  momentumType: MomentumType;
}

export function MomentumBadge({ momentumType }: MomentumBadgeProps) {
  const config = {
    viral_candidate: {
      label: "Viral Candidate",
      variant: "default" as const,
      icon: <Zap className="h-3 w-3" />,
      className: "bg-purple-500 text-white",
    },
    organic_spike: {
      label: "Organic Spike",
      variant: "default" as const,
      icon: <TrendingUp className="h-3 w-3" />,
      className: "bg-blue-500 text-white",
    },
    steady_growth: {
      label: "Steady Growth",
      variant: "default" as const,
      icon: <Activity className="h-3 w-3" />,
      className: "bg-green-500 text-white",
    },
    decaying: {
      label: "Decaying",
      variant: "destructive" as const,
      icon: <TrendingDown className="h-3 w-3" />,
      className: "bg-red-500 text-white",
    },
  };

  const { label, icon, className } = config[momentumType];

  return (
    <Badge className={className} variant={config[momentumType].variant}>
      <span className="flex items-center gap-1">
        {icon}
        {label}
      </span>
    </Badge>
  );
}

