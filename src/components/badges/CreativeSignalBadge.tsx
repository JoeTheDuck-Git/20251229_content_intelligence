import { Badge } from "@/components/ui/badge";
import { SignalType } from "@/types/competitor";
import { cn } from "@/lib/utils";

interface CreativeSignalBadgeProps {
  signalType: SignalType;
  signalName: string;
  frequency?: number;
  className?: string;
}

const signalTypeColors: Record<SignalType, string> = {
  keyword: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  hook: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  visual: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  narrative: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

export function CreativeSignalBadge({ signalType, signalName, frequency, className }: CreativeSignalBadgeProps) {
  return (
    <Badge className={cn(signalTypeColors[signalType], className)}>
      <span className="font-medium">{signalName}</span>
      {frequency !== undefined && (
        <span className="ml-1 text-xs opacity-75">({frequency})</span>
      )}
    </Badge>
  );
}

