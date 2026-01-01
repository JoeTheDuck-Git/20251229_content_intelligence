"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContentAsset } from "@/types";

interface TrendContextExamplesProps {
  assets: ContentAsset[];
}

export function TrendContextExamples({
  assets,
}: TrendContextExamplesProps) {
  // Select a small set of unranked examples (first 4 for demo)
  const exampleAssets = assets.slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Trend Context Examples</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          A small set of unranked content assets shown for visual context
          only. These are examples, not recommendations.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exampleAssets.map((asset) => (
            <Card key={asset.id} className="border-dashed">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {asset.platform}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {asset.contentType}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Duration: {asset.duration}s
                  </div>
                  <div className="pt-2 border-t space-y-1">
                    <Badge variant="outline" className="text-xs mr-1">
                      {asset.creativeFeatures.hookType}
                    </Badge>
                    <Badge variant="outline" className="text-xs mr-1">
                      {asset.creativeFeatures.pacing}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {asset.creativeFeatures.voiceType}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground pt-1">
                    Published: {asset.publishDate}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-xs text-amber-800">
            <strong>Note:</strong> These examples are displayed for context
            only. They are not ranked, prioritized, or recommended for
            imitation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

