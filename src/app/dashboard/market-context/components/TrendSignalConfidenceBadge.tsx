"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, HelpCircle, AlertCircle, Info } from "lucide-react";
import { useState } from "react";
import { getConfidenceExplanation } from "@/lib/trend/trend-signals/confidence-scorer";
import { ConfidenceDimensions } from "@/lib/trend/trend-signals/confidence-scorer";

interface TrendSignalConfidenceBadgeProps {
  confidence: "high" | "medium" | "low";
  dimensions: ConfidenceDimensions;
}

export function TrendSignalConfidenceBadge({
  confidence,
  dimensions,
}: TrendSignalConfidenceBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const explanation = getConfidenceExplanation(dimensions, confidence);

  const config = {
    high: {
      icon: CheckCircle2,
      color: "text-green-600",
      label: "High Confidence",
      badge: "bg-green-100 text-green-800 border-green-300",
    },
    medium: {
      icon: HelpCircle,
      color: "text-yellow-600",
      label: "Medium Confidence",
      badge: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
    low: {
      icon: AlertCircle,
      color: "text-gray-600",
      label: "Low Confidence",
      badge: "bg-gray-100 text-gray-800 border-gray-300",
    },
  };

  const { icon: Icon, label, badge } = config[confidence];

  return (
    <div className="relative">
      <div
        className="flex items-center gap-1.5 cursor-help"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Icon className={`h-3.5 w-3.5 ${config[confidence].color}`} />
        <Badge variant="outline" className={`text-xs ${badge}`}>
          {label}
        </Badge>
        <Info className="h-3 w-3 text-muted-foreground" />
      </div>
      
      {showTooltip && (
        <div className="absolute z-50 top-full right-0 mt-2 w-80 p-3 bg-background border border-border rounded-md shadow-lg text-xs">
          <div className="space-y-2">
            <p className="font-semibold text-foreground mb-2">Confidence Explanation</p>
            <p className="text-muted-foreground">{explanation}</p>
            <div className="pt-2 border-t mt-2">
              <p className="text-xs italic text-muted-foreground">
                <strong>Note:</strong> Confidence indicates observation reliability only. 
                It does not imply performance or strategic priority.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

