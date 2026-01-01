"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendStrategicInterpretation } from "@/types/trend";
import { ChevronDown, ChevronUp, Eye, Lightbulb, Target, Info, Shield } from "lucide-react";

interface InterpretedMarketSignalCardProps {
  interpretation: TrendStrategicInterpretation;
}

export function InterpretedMarketSignalCard({
  interpretation,
}: InterpretedMarketSignalCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
    <Card className="border-l-2 border-l-blue-300 bg-muted/30">
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <CardTitle className="text-base font-medium">
                {interpretation.signalTopic}
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {interpretation.signalCategory}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs ${getConfidenceColor(interpretation.observation.confidence)}`}
              >
                {interpretation.observation.confidence} confidence
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Contextual Signal
            </p>
          </div>
          <div className="ml-4">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4 pt-0">
          {/* 1. Observation */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-3.5 w-3.5 text-blue-600" />
              <h4 className="font-semibold text-xs">Observation</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              {interpretation.observation.description}
            </p>
          </section>

          {/* 2. Interpretation */}
          <section className="border-t pt-3">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
              <h4 className="font-semibold text-xs">Interpretation</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-1">
              {interpretation.interpretation.exploratoryStatement}
            </p>
            <p className="text-xs text-muted-foreground italic">
              {interpretation.interpretation.patternDescription}
            </p>
          </section>

          {/* 3. Strategic Implication */}
          <section className="border-t pt-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-3.5 w-3.5 text-purple-600" />
              <h4 className="font-semibold text-xs">Strategic Implication</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              {interpretation.strategicImplication.whyItMatters}
            </p>
            <p className="text-xs text-muted-foreground italic mt-1">
              {interpretation.strategicImplication.contextualRelevance}
            </p>
          </section>

          {/* 4. Applicability Scope */}
          <section className="border-t pt-3">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-3.5 w-3.5 text-indigo-600" />
              <h4 className="font-semibold text-xs">Applicability Scope</h4>
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline" className="text-xs">
                  Format(s): {interpretation.applicabilityScope.relevantFormats.join(" / ")}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Channel: Paid / Organic
                </Badge>
                {interpretation.applicabilityScope.funnelStages && (
                  <Badge variant="outline" className="text-xs">
                    Funnel Stage: {interpretation.applicabilityScope.funnelStages.join(" / ")}
                  </Badge>
                )}
              </div>
            </div>
          </section>

          {/* 5. Boundary & Caution */}
          <section className="border-t pt-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-3.5 w-3.5 text-red-600" />
              <h4 className="font-semibold text-xs">Boundary & Caution</h4>
            </div>
            <div className="space-y-2 p-2 bg-amber-50/50 border border-amber-200/50 rounded text-xs">
              <p className="text-amber-800">
                {interpretation.cautionBoundary.nonCausality}
              </p>
              <p className="text-amber-800">
                {interpretation.cautionBoundary.nonGuarantees}
              </p>
            </div>
          </section>
        </CardContent>
      )}
    </Card>
  );
}

