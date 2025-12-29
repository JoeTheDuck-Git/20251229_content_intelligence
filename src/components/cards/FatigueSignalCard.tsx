import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FatigueSignal } from "@/types/fatigue";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface FatigueSignalCardProps {
  signal: FatigueSignal;
}

export function FatigueSignalCard({ signal }: FatigueSignalCardProps) {
  const severityColors = {
    high: "text-red-600",
    medium: "text-yellow-600",
    low: "text-gray-400",
  };

  const severityBadges = {
    high: "destructive" as const,
    medium: "warning" as const,
    low: "secondary" as const,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {signal.type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </CardTitle>
          {signal.detected ? (
            <AlertCircle className={`h-4 w-4 ${severityColors[signal.severity]}`} />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={severityBadges[signal.severity]}>
            {signal.severity}
          </Badge>
          <Badge variant={signal.detected ? "destructive" : "success"}>
            {signal.detected ? "Detected" : "Not Detected"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{signal.description}</p>
      </CardContent>
    </Card>
  );
}

