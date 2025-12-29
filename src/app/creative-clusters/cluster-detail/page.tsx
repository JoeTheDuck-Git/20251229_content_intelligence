"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { clusterCreatives, getClusterAnalysis } from "@/lib/creative-clustering/cluster-creatives";
import { demoAdsAssets } from "@/lib/demo-data/ads-assets";
import { CreativeCluster, ClusterAnalysis } from "@/types/clustering";
import { ClusterInsightPanel } from "@/components/cards/ClusterInsightPanel";
import { CreativeMiniCard } from "@/components/cards/CreativeMiniCard";
import { generateCreativeSignature } from "@/lib/creative-clustering/creative-signature";

export default function ClusterDetailPage() {
  const searchParams = useSearchParams();
  const clusterId = searchParams.get("clusterId") || "";
  const [cluster, setCluster] = useState<CreativeCluster | null>(null);
  const [analysis, setAnalysis] = useState<ClusterAnalysis | null>(null);

  useEffect(() => {
    if (clusterId) {
      const clusters = clusterCreatives(demoAdsAssets);
      const foundCluster = clusters.find((c) => c.clusterId === clusterId);
      
      if (foundCluster) {
        setCluster(foundCluster);
        const clusterAnalysis = getClusterAnalysis(foundCluster);
        setAnalysis(clusterAnalysis);
      }
    }
  }, [clusterId]);

  if (!cluster || !analysis) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Cluster not found</p>
      </div>
    );
  }

  // Get asset details for mini cards
  const assets = demoAdsAssets.filter((asset) =>
    cluster.assetIds.includes(asset.id)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{cluster.label}</h1>
        <p className="text-muted-foreground mt-2">
          Cluster ID: {cluster.clusterId}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ClusterInsightPanel analysis={analysis} />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Creatives in Cluster</h2>
          <div className="space-y-2">
            {assets.map((asset) => {
              const signature = generateCreativeSignature(asset);
              return (
                <CreativeMiniCard
                  key={asset.id}
                  assetId={asset.id}
                  platform={asset.platform}
                  duration={asset.duration}
                  fatigueStatus={signature.fatigueStatus}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

