import { Badge } from "@/components/ui/badge";
import { FatigueStatus, ScalePotential } from "@/types/ads";

interface IntelligenceBadgeProps {
  type: "fatigue" | "scale";
  value: FatigueStatus | ScalePotential;
}

export function IntelligenceBadge({ type, value }: IntelligenceBadgeProps) {
  const config = {
    fatigue: {
      healthy: { variant: "success" as const, label: "Healthy" },
      warning: { variant: "warning" as const, label: "Warning" },
      fatigued: { variant: "destructive" as const, label: "Fatigued" },
    },
    scale: {
      low: { variant: "destructive" as const, label: "Low Scale" },
      medium: { variant: "secondary" as const, label: "Medium Scale" },
      high: { variant: "success" as const, label: "High Scale" },
    },
  } as const;

  if (type === "fatigue") {
    const fatigueConfig = config.fatigue[value as FatigueStatus];
    return <Badge variant={fatigueConfig.variant}>{fatigueConfig.label}</Badge>;
  } else {
    const scaleConfig = config.scale[value as ScalePotential];
    return <Badge variant={scaleConfig.variant}>{scaleConfig.label}</Badge>;
  }
}

