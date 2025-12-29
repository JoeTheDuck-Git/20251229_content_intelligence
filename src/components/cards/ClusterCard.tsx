import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreativeCluster } from "@/types/clustering";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface ClusterCardProps {
  cluster: CreativeCluster;
}

export function ClusterCard({ cluster }: ClusterCardProps) {
  const riskConfig = {
    low: { variant: "success" as const, icon: <CheckCircle2 className="h-4 w-4" /> },
    medium: { variant: "warning" as const, icon: <AlertTriangle className="h-4 w-4" /> },
    high: { variant: "destructive" as const, icon: <AlertTriangle className="h-4 w-4" /> },
  };

  const reliabilityConfig = {
    reliable: { variant: "success" as const, label: "Reliable" },
    moderate: { variant: "secondary" as const, label: "Moderate" },
    unstable: { variant: "warning" as const, label: "Unstable" },
  };

  const risk = riskConfig[cluster.fatigueRiskLevel];
  const reliability = reliabilityConfig[cluster.scaleReliability];

  return (
    <Link href={`/creative-clusters/cluster-detail?clusterId=${cluster.clusterId}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{cluster.label}</CardTitle>
            <div className="flex items-center gap-2">
              {risk.icon}
              <Badge variant={risk.variant}>{cluster.fatigueRiskLevel} Risk</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Creatives</span>
            <span className="font-medium">{cluster.assetIds.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Scale Reliability</span>
            <Badge variant={reliability.variant}>{reliability.label}</Badge>
          </div>
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground line-clamp-2">
              {cluster.explanation || "No explanation available"}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

