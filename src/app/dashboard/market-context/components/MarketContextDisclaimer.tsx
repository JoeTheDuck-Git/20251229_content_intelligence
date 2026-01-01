"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export function MarketContextDisclaimer() {
  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <h4 className="font-semibold text-amber-900">
              Strategy Boundary Notice
            </h4>
            <p className="text-sm text-amber-800">
              Market Context presents interpreted market signals for strategic consideration.
              These signals inform context, not decisions. This information does not provide
              execution guidance and should not be used as the sole basis for strategic
              decisions. For strategic recommendations, refer to the Strategy Feedback section.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

