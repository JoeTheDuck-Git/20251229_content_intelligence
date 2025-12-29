"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StrategicPositioningStatement {
  statement: string;
  confidence: "high" | "medium" | "low";
}

interface StrategicPositioningSummaryProps {
  statements: StrategicPositioningStatement[];
}

export function StrategicPositioningSummary({
  statements,
}: StrategicPositioningSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Strategic Positioning Summary</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          What this means strategically
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {statements.map((item, idx) => (
            <li key={idx} className="flex gap-3">
              <span className="text-muted-foreground text-sm mt-0.5">•</span>
              <div className="flex-1">
                <p className="text-sm leading-relaxed">{item.statement}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

