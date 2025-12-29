import { Badge } from "@/components/ui/badge";
import { AlignmentStrength } from "@/types/trend";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface AlignmentBadgeProps {
  strength: AlignmentStrength;
}

export function AlignmentBadge({ strength }: AlignmentBadgeProps) {
  const config = {
    strong: {
      label: "Strong Alignment",
      icon: <CheckCircle2 className="h-3 w-3" />,
      className: "bg-green-500 text-white",
    },
    weak: {
      label: "Weak Alignment",
      icon: <AlertCircle className="h-3 w-3" />,
      className: "bg-yellow-500 text-white",
    },
    none: {
      label: "No Alignment",
      icon: <XCircle className="h-3 w-3" />,
      className: "bg-gray-500 text-white",
    },
  };

  const { label, icon, className } = config[strength];

  return (
    <Badge className={className}>
      <span className="flex items-center gap-1">
        {icon}
        {label}
      </span>
    </Badge>
  );
}

