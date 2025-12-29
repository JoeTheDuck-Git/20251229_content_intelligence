import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SignalHealth } from "@/lib/content-overview/signal-balance-analyzer";
import { CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";

interface SignalHealthIndicatorProps {
  title: string;
  status: SignalHealth;
  value: number;
  description: string;
}

const statusConfig: Record<
  SignalHealth,
  { icon: React.ReactNode; color: string; badgeVariant: "success" | "warning" | "destructive" }
> = {
  healthy: {
    icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    color: "text-green-600",
    badgeVariant: "success",
  },
  watch: {
    icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    color: "text-yellow-600",
    badgeVariant: "warning",
  },
  risk: {
    icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
    color: "text-red-600",
    badgeVariant: "destructive",
  },
};

export function SignalHealthIndicator({
  title,
  status,
  value,
  description,
}: SignalHealthIndicatorProps) {
  const config = statusConfig[status];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center gap-2">
            {config.icon}
            <Badge variant={config.badgeVariant}>{status.toUpperCase()}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${config.color}`}>
              {value.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">/ 10</span>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

