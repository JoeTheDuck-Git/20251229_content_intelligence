"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendStrategicInterpretation } from "@/types/trend";
import { AlertTriangle, Info, Eye, Lightbulb, Target, Shield } from "lucide-react";

interface TrendStrategicInterpretationCardProps {
  interpretation: TrendStrategicInterpretation;
}

export function TrendStrategicInterpretationCard({
  interpretation,
}: TrendStrategicInterpretationCardProps) {
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
    <Card className="border-l-4 border-blue-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg mb-1">
              Strategic Interpretation: {interpretation.signalTopic}
            </CardTitle>
            <Badge variant="outline" className="text-xs mt-1">
              {interpretation.signalCategory}
            </Badge>
          </div>
          <Badge
            variant="outline"
            className={`text-xs ${getConfidenceColor(interpretation.observation.confidence)}`}
          >
            {interpretation.observation.confidence} confidence
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 1. Observation */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-4 w-4 text-blue-600" />
            <h4 className="font-semibold text-sm">Observation</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {interpretation.observation.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              Formats: {interpretation.observation.observedContexts.formats?.join(", ")}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Channels: {interpretation.observation.observedContexts.channels?.join(", ")}
            </Badge>
          </div>
        </section>

        {/* 2. Interpretation */}
        <section className="border-t pt-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-amber-600" />
            <h4 className="font-semibold text-sm">Interpretation</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {interpretation.interpretation.exploratoryStatement}
          </p>
          <p className="text-xs text-muted-foreground italic">
            {interpretation.interpretation.patternDescription}
          </p>
        </section>

        {/* 3. Strategic Implication */}
        <section className="border-t pt-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-purple-600" />
            <h4 className="font-semibold text-sm">Strategic Implication</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {interpretation.strategicImplication.whyItMatters}
          </p>
          <p className="text-xs text-muted-foreground italic">
            {interpretation.strategicImplication.contextualRelevance}
          </p>
        </section>

        {/* 4. Applicability Scope */}
        <section className="border-t pt-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-indigo-600" />
            <h4 className="font-semibold text-sm">Applicability Scope</h4>
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                Formats: {interpretation.applicabilityScope.relevantFormats.join(", ")}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Channels: {interpretation.applicabilityScope.relevantChannels.join(", ")}
              </Badge>
              {interpretation.applicabilityScope.funnelStages && (
                <Badge variant="outline" className="text-xs">
                  Stages: {interpretation.applicabilityScope.funnelStages.join(", ")}
                </Badge>
              )}
            </div>
            {interpretation.applicabilityScope.notes && (
              <p className="text-xs text-muted-foreground italic">
                {interpretation.applicabilityScope.notes}
              </p>
            )}
          </div>
        </section>

        {/* 5. Caution / Boundary */}
        <section className="border-t pt-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-red-600" />
            <h4 className="font-semibold text-sm">Caution / Boundary</h4>
          </div>
          <div className="space-y-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <div>
              <p className="text-xs font-medium text-amber-900 mb-1">
                Non-Causality:
              </p>
              <p className="text-xs text-amber-800">
                {interpretation.cautionBoundary.nonCausality}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-amber-900 mb-1">
                Non-Guarantees:
              </p>
              <p className="text-xs text-amber-800">
                {interpretation.cautionBoundary.nonGuarantees}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-amber-900 mb-1">
                Interpretation Limits:
              </p>
              <p className="text-xs text-amber-800">
                {interpretation.cautionBoundary.interpretationLimits}
              </p>
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

