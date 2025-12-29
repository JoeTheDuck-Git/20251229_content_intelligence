"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FocusArea {
  category: "leverage" | "caution" | "observation";
  description: string;
}

interface DirectionalOutlookProps {
  focusAreas: FocusArea[];
}

export function DirectionalOutlook({ focusAreas }: DirectionalOutlookProps) {
  const categoryLabels = {
    leverage: "Strategic Leverage",
    caution: "Strategic Caution",
    observation: "Requires Observation",
  };

  const categoryVariants = {
    leverage: "default" as const,
    caution: "secondary" as const,
    observation: "outline" as const,
  };

  const groupedAreas = {
    leverage: focusAreas.filter((a) => a.category === "leverage"),
    caution: focusAreas.filter((a) => a.category === "caution"),
    observation: focusAreas.filter((a) => a.category === "observation"),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Directional Outlook</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Where attention should be focused
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedAreas).map(([category, areas]) => {
          if (areas.length === 0) return null;
          return (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={categoryVariants[category as keyof typeof categoryVariants]}>
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </Badge>
              </div>
              <ul className="space-y-2">
                {areas.map((area, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground">
                    • {area.description}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

