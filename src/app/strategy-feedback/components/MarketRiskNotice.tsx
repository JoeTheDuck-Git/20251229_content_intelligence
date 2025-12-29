import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { MarketContextAnalysis } from "@/types/competitor";

interface MarketRiskNoticeProps {
  marketAnalysis: MarketContextAnalysis;
}

export function MarketRiskNotice({ marketAnalysis }: MarketRiskNoticeProps) {
  const getAlignmentText = () => {
    switch (marketAnalysis.overallAlignment) {
      case "aligned":
        return "Internal strategy aligns with market norms";
      case "crowded":
        return "Strategy leans into crowded creative territory";
      case "divergent":
        return "Strategy diverges from common market patterns";
    }
  };
  
  const getSaturationText = () => {
    if (marketAnalysis.overrepresentedTags.length === 0) {
      return "Current strategy avoids most crowded creative patterns.";
    }
    return "Several recommended actions rely on heavily used market narratives.";
  };
  
  return (
    <Card className="border-blue-500/50 bg-blue-500/5">
      <CardHeader>
        <CardTitle className="text-lg">Market Context Check</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Market context reflects observed competitor usage patterns. Strategy recommendations are based on internal performance signals.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Alignment */}
        <div>
          <p className="text-sm font-medium mb-2">Market Alignment</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{getAlignmentText()}</Badge>
          </div>
        </div>
        
        {/* Overrepresented Tags */}
        {marketAnalysis.overrepresentedTags.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Overrepresented Creative Tags</p>
            <div className="flex flex-wrap gap-2">
              {marketAnalysis.overrepresentedTags.map((tag, idx) => (
                <Badge key={idx} variant="warning" className="text-xs">
                  {tag.tagName} ({tag.tagType})
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Underrepresented Tags */}
        {marketAnalysis.underrepresentedTags.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Underrepresented Tags (Not Leveraged)</p>
            <div className="flex flex-wrap gap-2">
              {marketAnalysis.underrepresentedTags.slice(0, 5).map((tag, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {tag.tagName} ({tag.tagType})
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Risk Summary */}
        <div className="pt-4 border-t">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium mb-1">Market Saturation Risk</p>
              <p className="text-sm text-muted-foreground mb-2">{getSaturationText()}</p>
              <Badge 
                variant={
                  marketAnalysis.saturationRisk === "high" ? "destructive" :
                  marketAnalysis.saturationRisk === "medium" ? "warning" : "success"
                }
              >
                {marketAnalysis.saturationRisk} risk
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

