import { Badge } from "@/components/ui/badge";
import { StabilityLevel } from "@/types/creative-performance";

interface StabilityBadgeProps {
  stability: StabilityLevel;
  label?: string;
}

export function StabilityBadge({ stability, label }: StabilityBadgeProps) {
  const colors =
    stability === "consistent"
      ? "bg-blue-100 text-blue-800 border-blue-300"
      : "bg-orange-100 text-orange-800 border-orange-300";

  return (
    <Badge variant="outline" className={colors}>
      {label || stability.charAt(0).toUpperCase() + stability.slice(1)}
    </Badge>
  );
}

