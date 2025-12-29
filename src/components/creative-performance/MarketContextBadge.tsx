import { Badge } from "@/components/ui/badge";
import { MarketPresence, MarketSaturation, MarketUsage } from "@/types/creative-performance";

interface MarketContextBadgeProps {
  type: "presence" | "saturation" | "usage";
  value: MarketPresence | MarketSaturation | MarketUsage;
}

export function MarketContextBadge({ type, value }: MarketContextBadgeProps) {
  const getColors = () => {
    if (type === "presence") {
      const presence = value as MarketPresence;
      if (presence === "overrepresented") {
        return "bg-purple-100 text-purple-800 border-purple-300";
      } else if (presence === "aligned") {
        return "bg-blue-100 text-blue-800 border-blue-300";
      } else {
        return "bg-gray-100 text-gray-800 border-gray-300";
      }
    } else if (type === "saturation") {
      const saturation = value as MarketSaturation;
      if (saturation === "saturated") {
        return "bg-orange-100 text-orange-800 border-orange-300";
      } else if (saturation === "common") {
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      } else {
        return "bg-green-100 text-green-800 border-green-300";
      }
    } else {
      const usage = value as MarketUsage;
      if (usage === "heavily used") {
        return "bg-orange-100 text-orange-800 border-orange-300";
      } else if (usage === "typical") {
        return "bg-blue-100 text-blue-800 border-blue-300";
      } else {
        return "bg-gray-100 text-gray-800 border-gray-300";
      }
    }
  };

  const formatLabel = (val: string) => {
    return val
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Badge variant="outline" className={`text-xs ${getColors()}`}>
      {formatLabel(value)}
    </Badge>
  );
}

