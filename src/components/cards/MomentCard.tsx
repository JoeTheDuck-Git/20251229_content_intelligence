import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MomentContext } from "@/types/trend";
import { MomentIntensityBadge } from "@/components/badges/MomentIntensityBadge";

interface MomentCardProps {
  moment: MomentContext;
}

export function MomentCard({ moment }: MomentCardProps) {
  const categoryLabels = {
    trending: "Trending",
    seasonal: "Seasonal",
    event: "Event",
    cultural: "Cultural",
    "platform-native": "Platform Native",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{moment.topic}</CardTitle>
          <MomentIntensityBadge intensity={moment.intensityLevel} />
        </div>
        {moment.category && (
          <Badge variant="outline" className="mt-2">
            {categoryLabels[moment.category]}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {moment.description && (
          <p className="text-sm text-muted-foreground mb-4">{moment.description}</p>
        )}
        <div className="space-y-2">
          <div>
            <p className="text-xs text-muted-foreground">Active Period</p>
            <p className="text-sm font-medium">
              {moment.startDate} - {moment.endDate}
            </p>
          </div>
          {moment.relatedKeywords && moment.relatedKeywords.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Related Keywords</p>
              <div className="flex flex-wrap gap-1">
                {moment.relatedKeywords.slice(0, 5).map((keyword, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

