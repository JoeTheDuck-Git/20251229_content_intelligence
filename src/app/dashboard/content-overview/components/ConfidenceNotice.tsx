import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfidenceAssessment } from "@/lib/content-overview/confidence-evaluator";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

interface ConfidenceNoticeProps {
  confidence: ConfidenceAssessment;
}

export function ConfidenceNotice({ confidence }: ConfidenceNoticeProps) {
  const iconMap = {
    high: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    medium: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    low: <XCircle className="h-5 w-5 text-red-500" />,
  };

  const badgeVariant = {
    high: "success" as const,
    medium: "warning" as const,
    low: "destructive" as const,
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {iconMap[confidence.overall]}
            Strategy Confidence Assessment
          </CardTitle>
          <Badge variant={badgeVariant[confidence.overall]}>
            {confidence.overall.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Data Completeness</p>
            <p className="text-2xl font-bold">{confidence.dataCompleteness.toFixed(0)}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Signal Consistency</p>
            <p className="text-2xl font-bold">{confidence.signalConsistency.toFixed(0)}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Strategy Reliability</p>
            <p className="text-2xl font-bold">{confidence.strategyReliability.toFixed(0)}%</p>
          </div>
        </div>

        {confidence.missingSources.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Missing Data Sources</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {confidence.missingSources.map((source, idx) => (
                <li key={idx}>{source}</li>
              ))}
            </ul>
          </div>
        )}

        {confidence.warnings.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2 text-yellow-600">Warnings</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
              {confidence.warnings.map((warning, idx) => (
                <li key={idx}>{warning}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

