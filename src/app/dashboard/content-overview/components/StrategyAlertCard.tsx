import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StrategicTension } from "@/lib/content-overview/tension-detector";
import { AlertTriangle } from "lucide-react";

interface StrategyAlertCardProps {
  tension: StrategicTension;
}

const severityColors = {
  high: "border-red-200 bg-red-50",
  medium: "border-yellow-200 bg-yellow-50",
  low: "border-blue-200 bg-blue-50",
};

export function StrategyAlertCard({ tension }: StrategyAlertCardProps) {
  return (
    <Card className={severityColors[tension.severity]}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              {tension.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{tension.description}</p>
          </div>
          <Badge
            variant={tension.severity === "high" ? "destructive" : "warning"}
            className="ml-2"
          >
            {tension.severity.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-1">What is happening</h4>
          <p className="text-sm text-muted-foreground">{tension.whatIsHappening}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-1">Why it matters</h4>
          <p className="text-sm text-muted-foreground">{tension.whyItMatters}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-1">What to watch next</h4>
          <p className="text-sm text-muted-foreground">{tension.whatToWatch}</p>
        </div>
      </CardContent>
    </Card>
  );
}

