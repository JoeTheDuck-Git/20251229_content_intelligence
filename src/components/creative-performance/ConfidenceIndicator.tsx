import { Badge } from "@/components/ui/badge";
import { ConfidenceLevel } from "@/types/creative-performance";
import { AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";

interface ConfidenceIndicatorProps {
  confidence: ConfidenceLevel;
  showIcon?: boolean;
}

export function ConfidenceIndicator({
  confidence,
  showIcon = true,
}: ConfidenceIndicatorProps) {
  const config = {
    high: {
      icon: CheckCircle2,
      color: "text-green-600",
      label: "High Confidence",
      badge: "bg-green-100 text-green-800 border-green-300",
    },
    medium: {
      icon: HelpCircle,
      color: "text-yellow-600",
      label: "Medium Confidence",
      badge: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
    low: {
      icon: AlertCircle,
      color: "text-gray-600",
      label: "Low Confidence",
      badge: "bg-gray-100 text-gray-800 border-gray-300",
    },
  };

  const { icon: Icon, label, badge } = config[confidence];

  return (
    <div className="flex items-center gap-1.5">
      {showIcon && <Icon className={`h-3.5 w-3.5 ${config[confidence].color}`} />}
      <Badge variant="outline" className={`text-xs ${badge}`}>
        {label}
      </Badge>
    </div>
  );
}

