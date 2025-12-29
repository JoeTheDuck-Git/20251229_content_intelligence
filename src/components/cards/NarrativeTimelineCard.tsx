import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { YouTubeNarrativeSegment } from "@/types/youtube";

interface NarrativeTimelineCardProps {
  segments: YouTubeNarrativeSegment[];
  totalDuration: number;
}

export function NarrativeTimelineCard({ segments, totalDuration }: NarrativeTimelineCardProps) {
  const segmentColors = {
    hook: "bg-blue-500",
    setup: "bg-yellow-500",
    core: "bg-green-500",
    payoff: "bg-purple-500",
  };
  
  const segmentLabels = {
    hook: "Hook",
    setup: "Setup",
    core: "Core",
    payoff: "Payoff",
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Narrative Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {segments.map((segment, idx) => {
            const width = ((segment.endSecond - segment.startSecond) / totalDuration) * 100;
            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={segmentColors[segment.segmentType]}>
                      {segmentLabels[segment.segmentType]}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {segment.startSecond}s - {segment.endSecond}s
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {segment.endSecond - segment.startSecond}s
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`${segmentColors[segment.segmentType]} h-4 rounded-full`}
                    style={{ width: `${width}%` }}
                  />
                </div>
                {segment.description && (
                  <p className="text-xs text-muted-foreground">{segment.description}</p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

