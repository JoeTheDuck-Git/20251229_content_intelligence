"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendSignal } from "@/types/trend";
import { TimePerspective } from "@/types/creative-performance";
import { ArrowUp, ArrowDown, Minus, Sparkles } from "lucide-react";
import { getPresenceChangeLabel } from "@/lib/trend/trend-signals/trend-signal-analyzer";
import { TrendSignalConfidenceBadge } from "./TrendSignalConfidenceBadge";

interface TrendSignalsPanelProps {
  signals: TrendSignal[];
  timePerspective: TimePerspective;
}

export function TrendSignalsPanel({
  signals,
  timePerspective,
}: TrendSignalsPanelProps) {
  const getPresenceIcon = (change: string) => {
    switch (change) {
      case "increasing":
        return <ArrowUp className="h-4 w-4 text-green-600" />;
      case "decreasing":
        return <ArrowDown className="h-4 w-4 text-red-600" />;
      case "emerging":
        return <Sparkles className="h-4 w-4 text-blue-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPresenceColor = (change: string) => {
    switch (change) {
      case "increasing":
        return "bg-green-50 text-green-800 border-green-200";
      case "decreasing":
        return "bg-red-50 text-red-800 border-red-200";
      case "emerging":
        return "bg-blue-50 text-blue-800 border-blue-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  const getCurrentPresence = (signal: TrendSignal) => {
    switch (timePerspective) {
      case "Recent":
        return signal.presence.recent;
      case "MidTerm":
        return signal.presence.midTerm;
      case "Baseline":
        return signal.presence.baseline;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Trend Signals</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Topic and tag presence changes across time perspectives. This shows
          what is being observed, not what should be done.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {signals.map((signal) => {
          const currentPresence = getCurrentPresence(signal);
          return (
            <Card
              key={signal.id}
              className={`border-l-4 ${getPresenceColor(currentPresence)}`}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-semibold">{signal.topic}</h4>
                      <Badge variant="outline" className="text-xs">
                        {signal.category}
                      </Badge>
                      {signal.confidenceDimensions && (
                        <TrendSignalConfidenceBadge
                          confidence={signal.confidence}
                          dimensions={signal.confidenceDimensions}
                        />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {signal.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {getPresenceIcon(currentPresence)}
                    <span className="text-sm font-medium">
                      {getPresenceChangeLabel(currentPresence)}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Recent
                    </p>
                    <div className="flex items-center gap-1">
                      {getPresenceIcon(signal.presence.recent)}
                      <span className="text-xs">
                        {getPresenceChangeLabel(signal.presence.recent)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Mid-Term
                    </p>
                    <div className="flex items-center gap-1">
                      {getPresenceIcon(signal.presence.midTerm)}
                      <span className="text-xs">
                        {getPresenceChangeLabel(signal.presence.midTerm)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Baseline
                    </p>
                    <div className="flex items-center gap-1">
                      {getPresenceIcon(signal.presence.baseline)}
                      <span className="text-xs">
                        {getPresenceChangeLabel(signal.presence.baseline)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}

