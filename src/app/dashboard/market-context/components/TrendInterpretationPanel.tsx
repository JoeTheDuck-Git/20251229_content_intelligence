"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendInterpretation } from "@/types/trend";

interface TrendInterpretationPanelProps {
  interpretations: TrendInterpretation[];
}

export function TrendInterpretationPanel({
  interpretations,
}: TrendInterpretationPanelProps) {
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "high":
        return "bg-green-50 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Trend Interpretation</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Narrative interpretation of observed patterns. This describes what is
          being seen, not what should be done.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {interpretations.map((interpretation) => (
          <Card
            key={interpretation.id}
            className={`border-l-4 ${getConfidenceColor(interpretation.confidence)}`}
          >
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold">{interpretation.title}</h4>
                <Badge variant="outline" className="text-xs">
                  {interpretation.confidence} confidence
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {interpretation.narrative}
              </p>
              <div className="pt-3 border-t">
                <p className="text-xs font-medium mb-2">Observed Patterns:</p>
                <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                  {interpretation.observedPatterns.map((pattern, index) => (
                    <li key={index}>{pattern}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

