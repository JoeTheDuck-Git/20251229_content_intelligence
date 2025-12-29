import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle } from "lucide-react";
import { ConfidenceLevel } from "@/types/strategy";
import { MarketContextAnalysis } from "@/types/competitor";

interface RiskNoticeProps {
  dataCompleteness: {
    fatigueData: boolean;
    clusterData: boolean;
    multiChannelData: boolean;
  };
  signalConsistency: number; // 0-100
  warnings: string[];
  overallConfidence: ConfidenceLevel;
  marketAnalysis?: MarketContextAnalysis;
}

export function RiskNotice({
  dataCompleteness,
  signalConsistency,
  warnings,
  overallConfidence,
  marketAnalysis,
}: RiskNoticeProps) {
  // Always show the notice, even if there are no warnings
  // This is a disclosure component that should always be visible

  // Add market-related warnings if applicable
  const allWarnings = [...warnings];
  if (marketAnalysis) {
    if (marketAnalysis.saturationRisk === "high") {
      allWarnings.push("High market saturation detected for recommended creative patterns");
    }
    if (marketAnalysis.divergenceRisk === "high") {
      allWarnings.push("Strategy significantly diverges from observed market patterns");
    }
  }

  return (
    <Card className="border-yellow-500/50 bg-yellow-500/5">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-3">
            <div>
              <p className="font-medium mb-2">Confidence & Uncertainty Disclosure</p>
              <p className="text-sm text-muted-foreground">
                Strategy recommendations are based on available data. Please review the following
                before making decisions.
              </p>
            </div>

            {/* Data Completeness Status */}
            <div>
              <p className="text-sm font-medium mb-2">Data Completeness Status</p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span>Fatigue Data</span>
                  <Badge
                    variant={dataCompleteness.fatigueData ? "success" : "destructive"}
                  >
                    {dataCompleteness.fatigueData ? "Available" : "Missing"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cluster Data</span>
                  <Badge
                    variant={dataCompleteness.clusterData ? "success" : "destructive"}
                  >
                    {dataCompleteness.clusterData ? "Available" : "Missing"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Multi-Channel Data</span>
                  <Badge
                    variant={
                      dataCompleteness.multiChannelData ? "success" : "destructive"
                    }
                  >
                    {dataCompleteness.multiChannelData ? "Available" : "Missing"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Signal Consistency Score */}
            <div>
              <p className="text-sm font-medium mb-2">Signal Consistency Score</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${Math.max(0, Math.min(100, signalConsistency || 0))}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{Math.round(signalConsistency || 0)}%</span>
              </div>
            </div>

            {/* Warnings */}
            {allWarnings.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Warnings
                </p>
                <ul className="space-y-1">
                  {allWarnings.map((warning, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">
                      • {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Overall Confidence */}
            <div>
              <p className="text-sm font-medium mb-2">Overall Confidence</p>
              <Badge
                variant={
                  overallConfidence === "high"
                    ? "success"
                    : overallConfidence === "medium"
                    ? "warning"
                    : "destructive"
                }
              >
                {overallConfidence} confidence
              </Badge>
            </div>

            {/* Transparency Notice */}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground italic">
                Market context reflects observed competitor usage patterns. Strategy recommendations are based on internal performance signals.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

