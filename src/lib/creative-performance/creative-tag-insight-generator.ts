/**
 * Creative Tag Insight Generator
 * 使用 InsightSentenceBuilder 生成合規的 insight 描述
 * 
 * 🔒 原則：
 * - 只描述觀察到的行為原因
 * - 不提供規範性建議
 * - 解釋模式出現的原因，而非該做什麼
 */

import { InsightSentenceBuilder } from "@/lib/insight-language/insight-sentence-framework";
import {
  getElementAffinity,
  mapAttentionModeToInsightFramework,
  mapCognitiveLoadToInsightFramework,
  mapExecutionSensitivityToInsightFramework,
  selectInsightTemplateFromAffinity,
} from "@/lib/creative-performance/element-context-affinity";
import { 
  PaidTagEfficiency, 
  OrganicTagResonance, 
  CrossFormatTagPerformance,
  CreativeInsight 
} from "@/types/creative-performance";

/**
 * 為 Paid Tag 生成 insight（使用 Affinity Matrix）
 */
export function generatePaidTagInsight(
  tag: PaidTagEfficiency
): CreativeInsight {
  const builder = new InsightSentenceBuilder();
  
  // 查找元素的 Affinity
  const affinity = getElementAffinity(tag.tagName);
  
  // 根據 Affinity 選擇模板
  const templateSelection = affinity
    ? selectInsightTemplateFromAffinity(affinity)
    : {
        useCognitiveLoadFraming: false,
        useAttentionModeFraming: true,
        useExecutionSensitivityFraming: true,
        useTemporalFraming: true,
      };

  // 使用 Affinity 資訊框架 insight（如果可用）
  if (affinity && templateSelection.useAttentionModeFraming) {
    const insightAttentionMode = mapAttentionModeToInsightFramework(affinity.attentionMode);
    builder.attentionModeFraming(
      `This ${tag.tagName} element`,
      insightAttentionMode,
      "paid distribution contexts where controlled amplification conditions apply"
    );
  }

  // 根據效率強度生成 insight
  if (tag.efficiencyStrength === "high") {
    if (affinity && templateSelection.useExecutionSensitivityFraming) {
      const insightExecutionSensitivity = mapExecutionSensitivityToInsightFramework(affinity.executionSensitivity);
      builder.executionSensitivityFraming(
        `This ${tag.tagName} element`,
        insightExecutionSensitivity,
        "amplification context and audience alignment factors"
      );
    } else {
      builder.distributionContextFraming(
        `This ${tag.tagName} element`,
        "paid",
        "controlled amplification conditions align with rapid attention capture patterns"
      );
    }
  } else if (tag.efficiencyStrength === "medium") {
    builder.distributionContextFraming(
      `This ${tag.tagName} element`,
      "paid",
      "performance varies based on amplification context and audience alignment"
    );
  } else {
    builder.distributionContextFraming(
      `This ${tag.tagName} element`,
      "paid",
      "observed performance suggests context-dependent execution factors"
    );
  }

  // 根據疲勞敏感度添加觀察
  if (tag.fatigueSensitivity === "high") {
    builder.temporalStabilityFraming(
      `This ${tag.tagName} element`,
      "declining",
      "Frequency saturation correlates with efficiency decline in observed paid contexts."
    );
  } else if (tag.fatigueSensitivity === "low") {
    builder.temporalStabilityFraming(
      `This ${tag.tagName} element`,
      "stable",
      "Performance demonstrates consistent stability under increased exposure."
    );
  }

  return {
    tag: tag.tagName,
    context: "paid",
    insightText: builder.build(2),
  };
}

/**
 * 為 Organic Tag 生成 insight（使用 Affinity Matrix）
 */
export function generateOrganicTagInsight(
  tag: OrganicTagResonance
): CreativeInsight {
  const builder = new InsightSentenceBuilder();
  
  // 查找元素的 Affinity
  const affinity = getElementAffinity(tag.tagName);
  
  // 根據 Affinity 選擇模板
  const templateSelection = affinity
    ? selectInsightTemplateFromAffinity(affinity)
    : {
        useCognitiveLoadFraming: false,
        useAttentionModeFraming: true,
        useExecutionSensitivityFraming: true,
        useTemporalFraming: true,
      };

  // 使用 Affinity 資訊框架 insight
  if (affinity && templateSelection.useAttentionModeFraming) {
    const insightAttentionMode = mapAttentionModeToInsightFramework(affinity.attentionMode);
    builder.attentionModeFraming(
      `This ${tag.tagName} element`,
      insightAttentionMode,
      "organic distribution environments where natural audience response patterns emerge"
    );
  }

  // 根據參與強度生成 insight
  if (tag.engagementStrength === "strong") {
    if (affinity && templateSelection.useCognitiveLoadFraming) {
      const insightCognitiveLoad = mapCognitiveLoadToInsightFramework(affinity.cognitiveLoad);
      builder.cognitiveLoadFraming(
        `This ${tag.tagName} element`,
        insightCognitiveLoad,
        "organic engagement contexts that support natural resonance"
      );
    } else {
      builder.distributionContextFraming(
        `This ${tag.tagName} element`,
        "organic",
        "natural audience response patterns align with sustained engagement contexts"
      );
    }
  } else if (tag.engagementStrength === "mixed") {
    builder.distributionContextFraming(
      `This ${tag.tagName} element`,
      "organic",
      "resonance varies based on platform-native fit and audience context"
    );
  } else {
    builder.distributionContextFraming(
      `This ${tag.tagName} element`,
      "organic",
      "observed engagement suggests context-dependent resonance factors"
    );
  }

  // 根據動量一致性添加觀察
  if (tag.momentumConsistency === "consistent") {
    builder.temporalStabilityFraming(
      `This ${tag.tagName} element`,
      "stable",
      "Momentum patterns demonstrate consistent stability over time."
    );
  } else {
    builder.temporalStabilityFraming(
      `This ${tag.tagName} element`,
      "declining",
      "Momentum patterns show variability across different engagement contexts."
    );
  }

  // 根據 long-tail signal 添加觀察
  if (tag.longTailSignal === "strong") {
    builder.momentumObservation(
      0.8, // 模擬 velocity
      "sustained engagement",
      "organic distribution environments that support long-term resonance"
    );
  }

  return {
    tag: tag.tagName,
    context: "organic",
    insightText: builder.build(2),
  };
}

/**
 * 為 Cross-Format Tag 生成 insight（使用 Affinity Matrix）
 */
export function generateCrossFormatTagInsight(
  tag: CrossFormatTagPerformance
): CreativeInsight {
  const builder = new InsightSentenceBuilder();
  
  // 查找元素的 Affinity
  const affinity = getElementAffinity(tag.tagName);
  
  // 根據跨格式一致性生成 insight
  if (tag.crossFormatConsistency === "consistent") {
    if (affinity && affinity.executionSensitivity === "low") {
      builder.executionSensitivityFraming(
        `This ${tag.tagName} element`,
        "stable",
        "format execution and audience context alignment"
      );
    } else {
      builder.executionSensitivityFraming(
        `This ${tag.tagName} element`,
        "stable",
        "format execution and audience context alignment"
      );
    }
  } else {
    builder.executionSensitivityFraming(
      `This ${tag.tagName} element`,
      "format_dependent",
      "format-specific execution requirements and audience expectations"
    );
  }

  // 為每個格式強度添加觀察
  tag.formatStrengths.forEach((format) => {
    if (format.strength === "strong") {
      builder.formatAware(
        `This ${tag.tagName} element`,
        format.format,
        "format-native execution patterns that align with audience expectations"
      );
    }
  });

  return {
    tag: tag.tagName,
    context: "cross-format",
    insightText: builder.build(2),
  };
}

