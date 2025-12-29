import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfidenceLevel } from "@/types/strategy";
import { MarketContextAnalysis } from "@/types/competitor";

interface ContextualConfidencePanelProps {
  internalConfidence: ConfidenceLevel;
  marketAnalysis: MarketContextAnalysis;
  internalSignalStrength: number; // 0-100
  dataCompleteness: number; // 0-100
}

export function ContextualConfidencePanel({
  internalConfidence,
  marketAnalysis,
  internalSignalStrength,
  dataCompleteness,
}: ContextualConfidencePanelProps) {
  const riskNotes: string[] = [];
  
  if (marketAnalysis.saturationRisk === "high") {
    riskNotes.push("High market saturation may reduce differentiation potential");
  }
  
  if (marketAnalysis.divergenceRisk === "high") {
    riskNotes.push("Strategy diverges significantly from market patterns");
  }
  
  if (dataCompleteness < 70) {
    riskNotes.push("Incomplete data may affect recommendation accuracy");
  }
  
  if (internalSignalStrength < 60) {
    riskNotes.push("Internal signal strength is moderate");
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Confidence & Risk Assessment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Internal Confidence */}
        <div>
          <p className="text-sm font-medium mb-2">Internal Signal Strength</p>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                internalConfidence === "high" ? "success" :
                internalConfidence === "medium" ? "warning" : "destructive"
              }
            >
              {internalConfidence} confidence
            </Badge>
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${Math.max(0, Math.min(100, internalSignalStrength))}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">{Math.round(internalSignalStrength)}%</span>
          </div>
        </div>
        
        {/* Data Completeness */}
        <div>
          <p className="text-sm font-medium mb-2">Data Completeness</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${Math.max(0, Math.min(100, dataCompleteness))}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">{Math.round(dataCompleteness)}%</span>
          </div>
        </div>
        
        {/* Market Context Factors */}
        <div>
          <p className="text-sm font-medium mb-2">Market Context Factors</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Market Saturation Risk</span>
              <Badge
                variant={
                  marketAnalysis.saturationRisk === "high" ? "destructive" :
                  marketAnalysis.saturationRisk === "medium" ? "warning" : "success"
                }
              >
                {marketAnalysis.saturationRisk}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Market Divergence Risk</span>
              <Badge
                variant={
                  marketAnalysis.divergenceRisk === "high" ? "destructive" :
                  marketAnalysis.divergenceRisk === "medium" ? "warning" : "success"
                }
              >
                {marketAnalysis.divergenceRisk}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Risk Notes */}
        {riskNotes.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">Risk Notes</p>
            <ul className="space-y-1">
              {riskNotes.map((note, idx) => (
                <li key={idx} className="text-sm text-muted-foreground">
                  • {note}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

