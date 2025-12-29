import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StrategyOutput } from "@/types/strategy";
import { PortfolioMap } from "@/lib/content-overview/portfolio-classifier";
import { GrowthSignalBalance } from "@/lib/content-overview/signal-balance-analyzer";
import { PlatformStrategyBadge } from "./PlatformStrategyBadge";
import { MarketContextAnalysis } from "@/types/competitor";

interface StrategyContextPanelProps {
  strategies: StrategyOutput[];
  portfolio: PortfolioMap;
  signalBalance: GrowthSignalBalance;
  marketAnalysis?: MarketContextAnalysis;
}

export function StrategyContextPanel({
  strategies,
  portfolio,
  signalBalance,
  marketAnalysis,
}: StrategyContextPanelProps) {
  // Count dominant clusters
  const clusterCounts = strategies.length;
  const dominantClusters = strategies
    .filter((s) => s.overallConfidence === "high")
    .slice(0, 3)
    .map((s) => s.clusterLabel);

  // Active platforms
  const activePlatforms = new Set<string>();
  strategies.forEach((s) => {
    s.recommendations.forEach((r) => {
      activePlatforms.add(r.platform);
    });
  });

  // Paid vs Organic balance
  const paidCount = portfolio.paidFirst.length + portfolio.dualUse.length;
  const organicCount = portfolio.organicFirst.length + portfolio.dualUse.length;
  const totalAssets =
    portfolio.organicFirst.length +
    portfolio.paidFirst.length +
    portfolio.dualUse.length +
    portfolio.momentOnly.length;

  const paidPercentage = totalAssets > 0 ? Math.round((paidCount / totalAssets) * 100) : 0;
  const organicPercentage =
    totalAssets > 0 ? Math.round((organicCount / totalAssets) * 100) : 0;

  // Strategy confidence summary
  const highConfidenceCount = strategies.filter(
    (s) => s.overallConfidence === "high"
  ).length;
  const mediumConfidenceCount = strategies.filter(
    (s) => s.overallConfidence === "medium"
  ).length;
  const lowConfidenceCount = strategies.filter(
    (s) => s.overallConfidence === "low"
  ).length;

  const getMarketContextText = () => {
    if (!marketAnalysis) return null;
    
    switch (marketAnalysis.overallAlignment) {
      case "aligned":
        return "Internal strategy aligns with market norms";
      case "crowded":
        return "Strategy leans into crowded creative territory";
      case "divergent":
        return "Strategy diverges from common market patterns";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Strategy Context Snapshot</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Immediate clarity on why recommendations exist
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Paid vs Organic Balance */}
        <div>
          <p className="text-sm font-medium mb-3">Paid vs Organic Balance</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Paid Assets</span>
              <span className="font-medium">{paidPercentage}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Organic Assets</span>
              <span className="font-medium">
                {organicPercentage}%
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full flex">
                <div
                  className="bg-blue-500"
                  style={{ width: `${paidPercentage}%` }}
                />
                <div
                  className="bg-green-500"
                  style={{ width: `${organicPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dominant Creative Clusters */}
        <div>
          <p className="text-sm font-medium mb-3">Dominant Creative Clusters</p>
          <div className="flex flex-wrap gap-2">
            {dominantClusters.length > 0 ? (
              dominantClusters.map((label, idx) => (
                <Badge key={idx} variant="outline">
                  {label}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                No high-confidence clusters identified
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {clusterCounts} total clusters analyzed
          </p>
        </div>

        {/* Active Platforms */}
        <div>
          <p className="text-sm font-medium mb-3">Active Platforms</p>
          <div className="flex flex-wrap gap-2">
            {Array.from(activePlatforms).map((platform) => (
              <PlatformStrategyBadge
                key={platform}
                platform={platform as any}
              />
            ))}
          </div>
        </div>

        {/* Strategy Confidence Summary */}
        <div>
          <p className="text-sm font-medium mb-3">Strategy Confidence Summary</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Badge variant="success" className="text-xs">
                  High
                </Badge>
              </span>
              <span className="font-medium">{highConfidenceCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Badge variant="warning" className="text-xs">
                  Medium
                </Badge>
              </span>
              <span className="font-medium">{mediumConfidenceCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Badge variant="destructive" className="text-xs">
                  Low
                </Badge>
              </span>
              <span className="font-medium">{lowConfidenceCount}</span>
            </div>
          </div>
        </div>

        {/* Market Context Indicator */}
        {marketAnalysis && (
          <div>
            <p className="text-sm font-medium mb-3">Market Context</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {getMarketContextText()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Informational only — does not affect recommendations
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

