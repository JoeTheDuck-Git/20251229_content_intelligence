import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CompetitorProfile } from "@/types/competitor";
import { Instagram, Music, Play } from "lucide-react";
import Link from "next/link";

interface CompetitorCardProps {
  competitor: CompetitorProfile;
  dominantThemes?: string[];
  recentShifts?: number;
}

const platformIcons = {
  Instagram: Instagram,
  TikTok: Music,
  YouTube: Play,
};

export function CompetitorCard({ competitor, dominantThemes = [], recentShifts = 0 }: CompetitorCardProps) {
  return (
    <Link href={`/competitor-intelligence/competitor-detail?competitorId=${competitor.id}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{competitor.brandName}</CardTitle>
            <Badge variant="secondary">{competitor.category}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Platforms:</span>
            <div className="flex gap-1">
              {competitor.platforms.map((platform) => {
                const Icon = platformIcons[platform];
                return <Icon key={platform} className="h-4 w-4" />;
              })}
            </div>
          </div>
          {dominantThemes.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground mb-1">Dominant Themes:</p>
              <div className="flex flex-wrap gap-1">
                {dominantThemes.slice(0, 3).map((theme) => (
                  <Badge key={theme} variant="outline" className="text-xs">
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {recentShifts > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline">{recentShifts} recent shifts</Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

