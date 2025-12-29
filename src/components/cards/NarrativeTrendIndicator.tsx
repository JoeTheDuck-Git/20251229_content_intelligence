import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendDirection } from "@/types/competitor";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface NarrativeTrendIndicatorProps {
  signalName: string;
  trendDirection: TrendDirection;
  changePercentage?: number;
  frequency: number;
}

export function NarrativeTrendIndicator({
  signalName,
  trendDirection,
  changePercentage,
  frequency,
}: NarrativeTrendIndicatorProps) {
  const trendConfig = {
    emerging: {
      icon: <ArrowUp className="h-4 w-4" />,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950",
      label: "Emerging",
    },
    declining: {
      icon: <ArrowDown className="h-4 w-4" />,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950",
      label: "Declining",
    },
    stable: {
      icon: <Minus className="h-4 w-4" />,
      color: "text-gray-600 dark:text-gray-400",
      bgColor: "bg-gray-50 dark:bg-gray-950",
      label: "Stable",
    },
  };

  const config = trendConfig[trendDirection];

  return (
    <Card className={cn("border-l-4", config.bgColor)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{signalName}</CardTitle>
          <div className={cn("flex items-center gap-1", config.color)}>
            {config.icon}
            <span className="text-xs font-medium">{config.label}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Frequency</span>
          <span className="font-medium">{frequency}</span>
        </div>
        {changePercentage !== undefined && (
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-muted-foreground">Change</span>
            <span className={cn("font-medium", config.color)}>
              {changePercentage > 0 ? "+" : ""}
              {changePercentage.toFixed(0)}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

