import { Badge } from "@/components/ui/badge";
import { Platform } from "@/types/strategy";

interface PlatformStrategyBadgeProps {
  platform: Platform;
}

export function PlatformStrategyBadge({ platform }: PlatformStrategyBadgeProps) {
  const platformColors = {
    Meta: "bg-blue-500 text-white",
    TikTok: "bg-black text-white",
    YouTube: "bg-red-500 text-white",
  };

  return (
    <Badge className={platformColors[platform]} variant="default">
      {platform}
    </Badge>
  );
}

