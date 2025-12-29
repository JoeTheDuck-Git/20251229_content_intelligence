import { Badge } from "@/components/ui/badge";
import { MomentIntensity } from "@/types/trend";
import { Flame, TrendingUp, Activity } from "lucide-react";

interface MomentIntensityBadgeProps {
  intensity: MomentIntensity;
}

export function MomentIntensityBadge({ intensity }: MomentIntensityBadgeProps) {
  const config = {
    high: {
      label: "High Intensity",
      icon: <Flame className="h-3 w-3" />,
      className: "bg-red-500 text-white",
    },
    medium: {
      label: "Medium Intensity",
      icon: <TrendingUp className="h-3 w-3" />,
      className: "bg-orange-500 text-white",
    },
    low: {
      label: "Low Intensity",
      icon: <Activity className="h-3 w-3" />,
      className: "bg-yellow-500 text-white",
    },
  };

  const { label, icon, className } = config[intensity];

  return (
    <Badge className={className}>
      <span className="flex items-center gap-1">
        {icon}
        {label}
      </span>
    </Badge>
  );
}

