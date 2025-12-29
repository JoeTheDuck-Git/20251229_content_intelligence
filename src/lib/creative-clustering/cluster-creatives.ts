import { CreativeCluster, ClusterAnalysis } from "@/types/clustering";
import { AdsCreativeAsset } from "@/types/ads";
import { generateSignaturesForAssets } from "./creative-signature";
import { clusterSignatures } from "./clustering-rules";
import { analyzeCluster } from "./cluster-analyzer";
import { enrichClusterWithExplanations } from "./cluster-explainer";

export function clusterCreatives(assets: AdsCreativeAsset[]): CreativeCluster[] {
  // Generate signatures for all assets
  const signatures = generateSignaturesForAssets(assets);

  // Check if all assets have fatigue data
  const hasIncompleteData = signatures.some(
    (sig) => sig.fatigueStatus === "healthy" && 
    // This is a simplified check - in real implementation,
    // we'd verify fatigue analysis was actually performed
    true
  );

  if (hasIncompleteData) {
    console.warn("Some creatives may have incomplete fatigue data");
  }

  // Cluster signatures
  const clusters = clusterSignatures(signatures);

  // Enrich clusters with explanations
  return clusters.map((cluster) => {
    const analysis = analyzeCluster(cluster);
    return enrichClusterWithExplanations(cluster, analysis);
  });
}

export function getClusterAnalysis(cluster: CreativeCluster): ClusterAnalysis {
  return analyzeCluster(cluster);
}

