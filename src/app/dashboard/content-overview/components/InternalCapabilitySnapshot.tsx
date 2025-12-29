"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CrossFormatCapability, CrossFormatTagPerformance } from "@/types/creative-performance";
import { StrengthLevel, StabilityLevel } from "@/types/creative-performance";

interface InternalCapabilitySnapshotProps {
  crossFormatCapability: CrossFormatCapability;
  topTags: CrossFormatTagPerformance[];
}

export function InternalCapabilitySnapshot({
  crossFormatCapability,
  topTags,
}: InternalCapabilitySnapshotProps) {
  const formatCoverage = [
    crossFormatCapability.textStrength !== "weak" ? "Text" : null,
    crossFormatCapability.imageStrength !== "weak" ? "Image" : null,
    crossFormatCapability.videoStrength !== "weak" ? "Video" : null,
  ].filter(Boolean);

  const stabilityLabel = {
    consistent: "Consistent",
    volatile: "Volatile",
  }[crossFormatCapability.overallStability];

  const strengthLabels = {
    strong: "Strong",
    mixed: "Mixed",
    weak: "Weak",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Internal Creative Capability Snapshot</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          What we are consistently good at
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top Creative Strengths */}
        <div>
          <h3 className="font-semibold text-sm mb-3">Top Internal Creative Strengths</h3>
          <ul className="space-y-2">
            {topTags.slice(0, 5).map((tag) => (
              <li key={tag.tagId} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{tag.tagName}</span>
                <Badge variant="outline" className="text-xs">
                  {strengthLabels[tag.formatStrengths[0]?.strength || "weak"]}
                </Badge>
              </li>
            ))}
          </ul>
        </div>

        {/* Capability Stability */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Capability Stability</span>
            <Badge
              variant={crossFormatCapability.overallStability === "consistent" ? "default" : "secondary"}
            >
              {stabilityLabel}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {crossFormatCapability.overallStability === "consistent"
              ? "Creative performance shows consistent patterns across formats and channels."
              : "Creative performance varies across formats, indicating format-specific strengths."}
          </p>
        </div>

        {/* Format Coverage */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Format Coverage</span>
            <div className="flex gap-1">
              {formatCoverage.map((format) => (
                <Badge key={format} variant="outline" className="text-xs">
                  {format}
                </Badge>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Active creative formats showing measurable performance signals.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

