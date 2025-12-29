import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FatigueStatus } from "@/types/clustering";
import { CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import Link from "next/link";

interface CreativeMiniCardProps {
  assetId: string;
  platform: string;
  duration: number;
  fatigueStatus: FatigueStatus;
}

export function CreativeMiniCard({
  assetId,
  platform,
  duration,
  fatigueStatus,
}: CreativeMiniCardProps) {
  const statusConfig = {
    healthy: {
      icon: <CheckCircle2 className="h-3 w-3 text-green-500" />,
      badge: "success" as const,
    },
    early_warning: {
      icon: <AlertTriangle className="h-3 w-3 text-yellow-500" />,
      badge: "warning" as const,
    },
    fatigued: {
      icon: <AlertCircle className="h-3 w-3 text-red-500" />,
      badge: "destructive" as const,
    },
  };

  const config = statusConfig[fatigueStatus];

  return (
    <Link href={`/ads-fatigue/creative-detail?assetId=${assetId}`}>
      <Card className="hover:shadow-sm transition-shadow">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {config.icon}
              <span className="text-sm font-medium">{assetId}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {platform}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {duration}s
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

