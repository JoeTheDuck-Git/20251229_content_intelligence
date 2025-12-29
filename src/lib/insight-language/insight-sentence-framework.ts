/**
 * 受控 Insight 句子生成框架
 * 確保所有 Creative / Content / Ads insights 符合語言規範
 * 
 * 🔒 核心原則：
 * - 描述行為原因，而非規範性規則
 * - 引用上下文，而非格式規則
 * - 避免指令性或教學性語言
 * - 不暗示排他性（「只在...有效」）
 * - 不暗示權威性（「最佳」、「已驗證」、「標準」）
 */

// ==================== 核心維度定義 ====================

export type CognitiveLoadLevel = "low" | "medium" | "high";
export type AttentionMode = "rapid_capture" | "sustained" | "interruptive" | "immersive";
export type ExecutionSensitivity = "format_dependent" | "context_dependent" | "stable";
export type TemporalStability = "recent" | "stable" | "declining" | "emerging";
export type DistributionContext = "paid" | "organic" | "hybrid";

export interface InsightContext {
  cognitiveLoad?: CognitiveLoadLevel;
  attentionMode?: AttentionMode;
  executionSensitivity?: ExecutionSensitivity;
  temporalStability?: TemporalStability;
  distributionContext?: DistributionContext;
  format?: string;
  platform?: string;
  metricValue?: number;
  metricName?: string;
}

// ==================== 禁止短語檢查 ====================

const FORBIDDEN_PHRASES = [
  "best practice",
  "industry standard",
  "should be used",
  "works best on",
  "only suitable for",
  "proven to work",
  "should",
  "must",
  "need to",
  "consider",
  "recommend",
  "proven",
  "best",
  "standard",
  "only works",
  "only",
  "exclusively",
];

export function validateInsightSentence(sentence: string): {
  isValid: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  const lowerSentence = sentence.toLowerCase();

  FORBIDDEN_PHRASES.forEach((phrase) => {
    if (lowerSentence.includes(phrase)) {
      violations.push(phrase);
    }
  });

  return {
    isValid: violations.length === 0,
    violations,
  };
}

// ==================== 合規句子模板 ====================

export class InsightSentenceBuilder {
  private sentences: string[] = [];

  /**
   * 格式感知（非規範性）
   * ✅ "When expressed through video, this element benefits from sequencing and pacing."
   * ❌ "This element should be used in video."
   */
  formatAware(element: string, format: string, benefit: string): this {
    this.sentences.push(
      `When expressed through ${format}, ${element} benefits from ${benefit}.`
    );
    return this;
  }

  /**
   * 認知負荷框架
   * ✅ "This narrative performs better in environments that allow higher cognitive load."
   * ❌ "This only works in long-form text."
   */
  cognitiveLoadFraming(
    element: string,
    loadLevel: CognitiveLoadLevel,
    environment: string
  ): this {
    const loadDescription =
      loadLevel === "high"
        ? "higher cognitive load"
        : loadLevel === "medium"
        ? "moderate cognitive load"
        : "lower cognitive load";

    this.sentences.push(
      `${element} performs better in environments that allow ${loadDescription}, which aligns with ${environment}.`
    );
    return this;
  }

  /**
   * 注意力模式框架
   * ✅ "This hook relies on rapid attention capture, which aligns with interruptive contexts."
   * ❌ "This is good for paid social."
   */
  attentionModeFraming(
    element: string,
    mode: AttentionMode,
    context: string
  ): this {
    const modeDescription =
      mode === "rapid_capture"
        ? "rapid attention capture"
        : mode === "sustained"
        ? "sustained attention"
        : mode === "interruptive"
        ? "interruptive attention patterns"
        : "immersive attention engagement";

    this.sentences.push(
      `${element} relies on ${modeDescription}, which aligns with ${context}.`
    );
    return this;
  }

  /**
   * 付費 vs 有機框架
   * ✅ "This element scales efficiently under controlled paid conditions."
   * ❌ "This is for paid ads only."
   */
  distributionContextFraming(
    element: string,
    context: DistributionContext,
    condition: string
  ): this {
    const contextDescription =
      context === "paid"
        ? "controlled paid conditions"
        : context === "organic"
        ? "organic distribution environments"
        : "hybrid distribution contexts";

    this.sentences.push(
      `${element} scales efficiently under ${contextDescription} where ${condition}.`
    );
    return this;
  }

  /**
   * 時間穩定性框架
   * ✅ "Recent performance strength does not yet indicate long-term capability."
   * ❌ "This is just a short-term trick."
   */
  temporalStabilityFraming(
    element: string,
    stability: TemporalStability,
    observation: string
  ): this {
    const stabilityDescription =
      stability === "recent"
        ? "Recent performance strength does not yet indicate long-term capability"
        : stability === "stable"
        ? "Performance demonstrates consistent stability over time"
        : stability === "declining"
        ? "Performance shows declining patterns over time"
        : "Performance shows emerging patterns that require observation";

    this.sentences.push(
      `${stabilityDescription}. ${observation}`
    );
    return this;
  }

  /**
   * 執行敏感度框架
   */
  executionSensitivityFraming(
    element: string,
    sensitivity: ExecutionSensitivity,
    context: string
  ): this {
    const sensitivityDescription =
      sensitivity === "format_dependent"
        ? "format-dependent execution"
        : sensitivity === "context_dependent"
        ? "context-dependent execution"
        : "stable execution across contexts";

    this.sentences.push(
      `${element} demonstrates ${sensitivityDescription}, with performance varying based on ${context}.`
    );
    return this;
  }

  /**
   * 組合多個維度的觀察
   */
  multiDimensionalObservation(
    element: string,
    context: InsightContext
  ): this {
    const parts: string[] = [];

    if (context.cognitiveLoad) {
      parts.push(
        `cognitive load requirements (${context.cognitiveLoad})`
      );
    }

    if (context.attentionMode) {
      const modeDesc =
        context.attentionMode === "rapid_capture"
          ? "rapid capture"
          : context.attentionMode === "sustained"
          ? "sustained engagement"
          : context.attentionMode === "interruptive"
          ? "interruptive patterns"
          : "immersive engagement";
      parts.push(`attention mode (${modeDesc})`);
    }

    if (context.distributionContext) {
      parts.push(
        `distribution context (${context.distributionContext})`
      );
    }

    if (context.temporalStability) {
      parts.push(
        `temporal stability (${context.temporalStability})`
      );
    }

    if (parts.length > 0) {
      this.sentences.push(
        `${element} behavior is influenced by ${parts.join(", ")}.`
      );
    }

    return this;
  }

  /**
   * 指標觀察（非規範性）
   */
  metricObservation(
    metricName: string,
    value: number,
    context: string
  ): this {
    this.sentences.push(
      `${metricName} of ${value.toFixed(1)} occurs in contexts where ${context}.`
    );
    return this;
  }

  /**
   * 疲勞觀察（非規範性）
   */
  fatigueObservation(
    frequency: number,
    roasDecline: string,
    context: string
  ): this {
    this.sentences.push(
      `Frequency saturation (${frequency.toFixed(1)}x) correlates with ${roasDecline} in environments where ${context}.`
    );
    return this;
  }

  /**
   * 轉換落差觀察（非規範性）
   */
  conversionGapObservation(
    ctr: number,
    roas: number,
    context: string
  ): this {
    this.sentences.push(
      `High engagement (CTR: ${ctr.toFixed(1)}%) with lower conversion efficiency (ROAS: ${roas.toFixed(1)}x) suggests post-click context alignment factors may be influencing outcomes.`
    );
    return this;
  }

  /**
   * 平台對齊觀察（非規範性）
   */
  platformAlignmentObservation(
    element: string,
    platform: string,
    signals: string,
    context: string
  ): this {
    this.sentences.push(
      `${element} signals (${signals}) align with ${platform} audience expectations in contexts where ${context}.`
    );
    return this;
  }

  /**
   * 動量觀察（非規範性）
   */
  momentumObservation(
    velocity: number,
    pattern: string,
    context: string
  ): this {
    this.sentences.push(
      `Engagement velocity (${velocity.toFixed(1)}) follows ${pattern} patterns, which aligns with ${context}.`
    );
    return this;
  }

  /**
   * 建構最終句子（最多 2 句）
   */
  build(maxSentences: number = 2): string {
    const validated: string[] = [];

    for (const sentence of this.sentences) {
      const validation = validateInsightSentence(sentence);
      if (validation.isValid) {
        validated.push(sentence);
        if (validated.length >= maxSentences) break;
      } else {
        console.warn(
          `Invalid insight sentence detected: "${sentence}". Violations: ${validation.violations.join(", ")}`
        );
      }
    }

    return validated.join(" ");
  }

  /**
   * 重置建構器
   */
  reset(): this {
    this.sentences = [];
    return this;
  }
}

// ==================== 便捷函數 ====================

/**
 * 生成合規的 insight 描述
 */
export function generateCompliantInsight(
  context: InsightContext,
  element: string
): string {
  const builder = new InsightSentenceBuilder();

  if (context.cognitiveLoad) {
    builder.cognitiveLoadFraming(
      element,
      context.cognitiveLoad,
      context.distributionContext || "observed contexts"
    );
  }

  if (context.attentionMode) {
    builder.attentionModeFraming(
      element,
      context.attentionMode,
      context.distributionContext === "paid"
        ? "interruptive contexts"
        : "organic engagement contexts"
    );
  }

  if (context.temporalStability && context.metricValue) {
    builder.temporalStabilityFraming(
      element,
      context.temporalStability,
      `Current ${context.metricName || "performance"} (${context.metricValue.toFixed(1)}) reflects this pattern.`
    );
  }

  return builder.build(2);
}

/**
 * 驗證並清理現有 insight 描述
 */
export function sanitizeInsightDescription(description: string): string {
  // 移除禁止短語並重構句子
  let sanitized = description;

  FORBIDDEN_PHRASES.forEach((phrase) => {
    const regex = new RegExp(phrase, "gi");
    sanitized = sanitized.replace(regex, "");
  });

  // 移除多餘空格
  sanitized = sanitized.replace(/\s+/g, " ").trim();

  // 如果句子被破壞，返回空字串（需要重新生成）
  if (sanitized.length < 10) {
    return "";
  }

  return sanitized;
}

