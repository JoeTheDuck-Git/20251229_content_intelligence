import { StrategyOutput, StrategyContext } from "@/types/strategy";
import { CreativeCluster } from "@/types/clustering";
import { buildStrategyContext } from "./strategy-context";
import { generateRecommendations } from "./action-generator";
import { evaluateOverallConfidence, evaluateDataCompleteness } from "./confidence-evaluator";
import { explainStrategy } from "./strategy-explainer";

export function generateStrategyOutput(cluster: CreativeCluster): StrategyOutput {
  // Build strategy context
  const context = buildStrategyContext(cluster);

  // Generate recommendations
  const recommendations = generateRecommendations(context);

  // Evaluate confidence
  const overallConfidence = evaluateOverallConfidence(context, recommendations);
  const dataCompleteness = evaluateDataCompleteness(context);

  // Generate explanation
  const strategyExplanation = explainStrategy(context, recommendations);

  return {
    clusterId: cluster.clusterId,
    clusterLabel: cluster.label,
    context,
    recommendations,
    overallConfidence,
    strategyExplanation,
    dataCompleteness,
  };
}

export function generateStrategyForAllClusters(
  clusters: CreativeCluster[]
): StrategyOutput[] {
  return clusters.map((cluster) => generateStrategyOutput(cluster));
}

