import { Badge } from "@/components/ui/badge";
import { PlatformFit } from "@/types/organic";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface PlatformFitIndicatorProps {
  platformFit: PlatformFit;
}

export function PlatformFitIndicator({ platformFit }: PlatformFitIndicatorProps) {
  const config = {
    high: {
      label: "High Fit",
      icon: <CheckCircle2 className="h-3 w-3" />,
      className: "bg-green-500 text-white",
    },
    medium: {
      label: "Medium Fit",
      icon: <AlertCircle className="h-3 w-3" />,
      className: "bg-yellow-500 text-white",
    },
    low: {
      label: "Low Fit",
      icon: <XCircle className="h-3 w-3" />,
      className: "bg-red-500 text-white",
    },
  };

  const { label, icon, className } = config[platformFit];

  return (
    <Badge className={className}>
      <span className="flex items-center gap-1">
        {icon}
        {label}
      </span>
    </Badge>
  );
}

