"use client";

import { useState, useEffect } from "react";
import { clusterCreatives } from "@/lib/creative-clustering/cluster-creatives";
import { generateStrategyForAllClusters } from "@/lib/strategy-engine/strategy-engine";
import { demoAdsAssets } from "@/lib/demo-data/ads-assets";
import { StrategyOutput } from "@/types/strategy";
import { StrategyCard } from "@/components/cards/StrategyCard";

export default function StrategyOverviewPage() {
  const [strategies, setStrategies] = useState<StrategyOutput[]>([]);

  useEffect(() => {
    const clusters = clusterCreatives(demoAdsAssets);
    const strategyOutputs = generateStrategyForAllClusters(clusters);
    setStrategies(strategyOutputs);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Strategy Feedback Overview</h1>
        <p className="text-muted-foreground mt-2">
          Platform-aware strategy recommendations based on creative intelligence
        </p>
      </div>

      {strategies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading strategies...</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {strategies.map((strategy) => (
            <StrategyCard key={strategy.clusterId} strategy={strategy} />
          ))}
        </div>
      )}
    </div>
  );
}

