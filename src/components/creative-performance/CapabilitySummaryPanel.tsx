import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StrengthLevel, StabilityLevel } from "@/types/creative-performance";
import { FormatStrengthIndicator } from "./FormatStrengthIndicator";
import { StabilityBadge } from "./StabilityBadge";

interface CapabilitySummaryPanelProps {
  textStrength: StrengthLevel;
  imageStrength: StrengthLevel;
  videoStrength: StrengthLevel;
  overallStability: StabilityLevel;
}

export function CapabilitySummaryPanel({
  textStrength,
  imageStrength,
  videoStrength,
  overallStability,
}: CapabilitySummaryPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Cross-Format Strength Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <FormatStrengthIndicator format="text" strength={textStrength} />
          <FormatStrengthIndicator format="image" strength={imageStrength} />
          <FormatStrengthIndicator format="video" strength={videoStrength} />
        </div>
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overall Stability</span>
            <StabilityBadge stability={overallStability} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

