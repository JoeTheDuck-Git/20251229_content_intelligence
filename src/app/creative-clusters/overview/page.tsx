"use client";

import { useState, useEffect } from "react";
import { clusterCreatives } from "@/lib/creative-clustering/cluster-creatives";
import { demoAdsAssets } from "@/lib/demo-data/ads-assets";
import { CreativeCluster } from "@/types/clustering";
import { ClusterCard } from "@/components/cards/ClusterCard";

export default function ClustersOverviewPage() {
  const [clusters, setClusters] = useState<CreativeCluster[]>([]);

  useEffect(() => {
    const clustered = clusterCreatives(demoAdsAssets);
    setClusters(clustered);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Creative Clusters</h1>
        <p className="text-muted-foreground mt-2">
          Grouped creatives by shared patterns and performance behavior
        </p>
      </div>

      {clusters.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading clusters...</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clusters.map((cluster) => (
            <ClusterCard key={cluster.clusterId} cluster={cluster} />
          ))}
        </div>
      )}
    </div>
  );
}

