/**
 * 內部專用 Element-Context Affinity Matrix
 * 
 * 🔒 使用約束：
 * - 只用於選擇 insight 句子模板
 * - 只用於框架解釋
 * - 不得生成規則或推薦
 * - 不得出現在 UI 中作為指導
 * 
 * 翻譯規則：Matrix → Insight Sentence，絕不：Matrix → Instruction
 */

export type ElementType = "hook" | "narrative" | "cta" | "visual" | "copy";
export type CognitiveLoadLevel = "low" | "medium" | "high";
export type AttentionMode = "interruptive" | "voluntary" | "intent-driven";
export type ExecutionSensitivityLevel = "low" | "medium" | "high";
export type TemporalNature = "immediate" | "accumulative";

/**
 * Element-Context Affinity 定義
 * 描述創意元素與上下文條件的內部關聯性
 */
export interface ElementContextAffinity {
  elementType: ElementType;
  cognitiveLoad: CognitiveLoadLevel;
  attentionMode: AttentionMode;
  executionSensitivity: ExecutionSensitivityLevel;
  temporalNature: TemporalNature;
}

/**
 * 內部 Affinity Matrix
 * 映射創意元素類型到上下文條件
 * 
 * 此矩陣用於：
 * - 根據觀察到的性能數據，推斷可能的上下文條件
 * - 選擇合適的 insight 句子模板
 * - 框架解釋性文字
 */
const ELEMENT_CONTEXT_AFFINITY_MATRIX: Record<string, ElementContextAffinity> = {
  // Hook 類型元素
  "Problem-Solution": {
    elementType: "hook",
    cognitiveLoad: "medium",
    attentionMode: "intent-driven",
    executionSensitivity: "medium",
    temporalNature: "immediate",
  },
  "Question Hook": {
    elementType: "hook",
    cognitiveLoad: "low",
    attentionMode: "interruptive",
    executionSensitivity: "low",
    temporalNature: "immediate",
  },
  "Story Hook": {
    elementType: "hook",
    cognitiveLoad: "high",
    attentionMode: "voluntary",
    executionSensitivity: "high",
    temporalNature: "accumulative",
  },
  "Social Proof": {
    elementType: "hook",
    cognitiveLoad: "low",
    attentionMode: "intent-driven",
    executionSensitivity: "low",
    temporalNature: "immediate",
  },
  "Urgency": {
    elementType: "hook",
    cognitiveLoad: "low",
    attentionMode: "interruptive",
    executionSensitivity: "medium",
    temporalNature: "immediate",
  },
  "Curiosity Gap": {
    elementType: "hook",
    cognitiveLoad: "medium",
    attentionMode: "interruptive",
    executionSensitivity: "medium",
    temporalNature: "immediate",
  },
  
  // Narrative 類型元素
  "narrative": {
    elementType: "narrative",
    cognitiveLoad: "high",
    attentionMode: "voluntary",
    executionSensitivity: "high",
    temporalNature: "accumulative",
  },
  
  // CTA 類型元素
  "cta": {
    elementType: "cta",
    cognitiveLoad: "low",
    attentionMode: "intent-driven",
    executionSensitivity: "low",
    temporalNature: "immediate",
  },
  
  // Visual 類型元素
  "visual": {
    elementType: "visual",
    cognitiveLoad: "low",
    attentionMode: "interruptive",
    executionSensitivity: "medium",
    temporalNature: "immediate",
  },
  
  // Copy 類型元素
  "copy": {
    elementType: "copy",
    cognitiveLoad: "medium",
    attentionMode: "voluntary",
    executionSensitivity: "medium",
    temporalNature: "accumulative",
  },
};

/**
 * 根據元素名稱查找對應的 Affinity
 * 
 * @param elementName - 創意元素名稱（如 "Problem-Solution", "Question Hook" 等）
 * @returns ElementContextAffinity 或 null（如果找不到）
 */
export function getElementAffinity(elementName: string): ElementContextAffinity | null {
  // 直接查找
  if (ELEMENT_CONTEXT_AFFINITY_MATRIX[elementName]) {
    return ELEMENT_CONTEXT_AFFINITY_MATRIX[elementName];
  }
  
  // 模糊匹配：檢查是否包含關鍵字
  const normalizedName = elementName.toLowerCase();
  
  // Hook 類型匹配
  if (normalizedName.includes("problem") || normalizedName.includes("solution")) {
    return ELEMENT_CONTEXT_AFFINITY_MATRIX["Problem-Solution"];
  }
  if (normalizedName.includes("question")) {
    return ELEMENT_CONTEXT_AFFINITY_MATRIX["Question Hook"];
  }
  if (normalizedName.includes("story") || normalizedName.includes("narrative")) {
    return ELEMENT_CONTEXT_AFFINITY_MATRIX["Story Hook"];
  }
  if (normalizedName.includes("social") || normalizedName.includes("proof")) {
    return ELEMENT_CONTEXT_AFFINITY_MATRIX["Social Proof"];
  }
  if (normalizedName.includes("urgency") || normalizedName.includes("limited")) {
    return ELEMENT_CONTEXT_AFFINITY_MATRIX["Urgency"];
  }
  if (normalizedName.includes("curiosity") || normalizedName.includes("gap")) {
    return ELEMENT_CONTEXT_AFFINITY_MATRIX["Curiosity Gap"];
  }
  
  // 默認返回 null（表示無法確定）
  return null;
}

/**
 * 將內部 AttentionMode 映射到 InsightSentenceBuilder 使用的 AttentionMode
 * 
 * 注意：這是內部轉換，不暴露給外部
 */
export function mapAttentionModeToInsightFramework(
  internalMode: AttentionMode
): "rapid_capture" | "sustained" | "interruptive" | "immersive" {
  const mapping: Record<AttentionMode, "rapid_capture" | "sustained" | "interruptive" | "immersive"> = {
    "interruptive": "rapid_capture",
    "voluntary": "sustained",
    "intent-driven": "rapid_capture",
  };
  
  return mapping[internalMode] || "sustained";
}

/**
 * 將內部 CognitiveLoadLevel 映射到 InsightSentenceBuilder 使用的 CognitiveLoadLevel
 */
export function mapCognitiveLoadToInsightFramework(
  internalLoad: CognitiveLoadLevel
): "low" | "medium" | "high" {
  return internalLoad; // 直接映射，類型相同
}

/**
 * 將內部 ExecutionSensitivityLevel 映射到 InsightSentenceBuilder 使用的 ExecutionSensitivity
 */
export function mapExecutionSensitivityToInsightFramework(
  internalSensitivity: ExecutionSensitivityLevel
): "format_dependent" | "context_dependent" | "stable" {
  const mapping: Record<ExecutionSensitivityLevel, "format_dependent" | "context_dependent" | "stable"> = {
    "high": "context_dependent",
    "medium": "context_dependent",
    "low": "stable",
  };
  
  return mapping[internalSensitivity] || "stable";
}

/**
 * 根據 Affinity 選擇合適的 Insight 句子模板
 * 
 * 此函數用於內部推理，根據元素類型選擇合適的 insight 框架
 * 不生成規則，只用於選擇描述性模板
 */
export function selectInsightTemplateFromAffinity(
  affinity: ElementContextAffinity
): {
  useCognitiveLoadFraming: boolean;
  useAttentionModeFraming: boolean;
  useExecutionSensitivityFraming: boolean;
  useTemporalFraming: boolean;
} {
  return {
    // 高認知負荷 → 使用認知負荷框架
    useCognitiveLoadFraming: affinity.cognitiveLoad === "high" || affinity.cognitiveLoad === "medium",
    
    // 所有注意力模式都使用注意力框架
    useAttentionModeFraming: true,
    
    // 高執行敏感度 → 使用執行敏感度框架
    useExecutionSensitivityFraming: affinity.executionSensitivity === "high" || affinity.executionSensitivity === "medium",
    
    // 累積性時間特性 → 使用時間框架
    useTemporalFraming: affinity.temporalNature === "accumulative",
  };
}

