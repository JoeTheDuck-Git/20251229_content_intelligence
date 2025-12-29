import { Badge } from "@/components/ui/badge";
import { ConfidenceLevel } from "@/types/creative-performance";
import { Info } from "lucide-react";

interface MarketConfidenceIndicatorProps {
  confidence: ConfidenceLevel;
}

export function MarketConfidenceIndicator({ confidence }: MarketConfidenceIndicatorProps) {
  const config = {
    high: {
      label: "High Confidence",
      badge: "bg-blue-100 text-blue-800 border-blue-300",
    },
    medium: {
      label: "Medium Confidence",
      badge: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
    low: {
      label: "Low Confidence",
      badge: "bg-gray-100 text-gray-800 border-gray-300",
    },
  };

  const { label, badge } = config[confidence];

  return (
    <div className="flex items-center gap-1.5">
      <Info className="h-3 w-3 text-muted-foreground" />
      <Badge variant="outline" className={`text-xs ${badge}`}>
        {label}
      </Badge>
    </div>
  );
}

