import { Info } from "lucide-react";

interface CompetitorSignalTooltipProps {
  explanation: string;
}

export function CompetitorSignalTooltip({ explanation }: CompetitorSignalTooltipProps) {
  return (
    <div className="flex items-start gap-2 p-2 bg-muted/50 rounded-md text-xs text-muted-foreground">
      <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
      <span>{explanation}</span>
    </div>
  );
}

