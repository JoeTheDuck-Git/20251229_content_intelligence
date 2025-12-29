import { OrganicContentAsset } from "@/types/organic";
import { TopicTag } from "@/types/trend";

export function extractTopics(asset: OrganicContentAsset): TopicTag {
  const title = asset.title || "";
  const hookStyle = asset.creativeSignals.hookStyle;
  
  // Simple keyword extraction based on title and creative signals
  const keywords: string[] = [];
  const titleLower = title.toLowerCase();
  
  // Extract keywords from title
  const commonTopics = [
    "tutorial", "guide", "routine", "morning", "productivity",
    "strategy", "content", "problem", "solution", "success",
    "story", "challenge", "trend", "q&a", "question",
    "product", "showcase", "educational", "deep dive"
  ];
  
  commonTopics.forEach(topic => {
    if (titleLower.includes(topic)) {
      keywords.push(topic);
    }
  });
  
  // Infer primary topic from hook style and title
  let primaryTopic = "general";
  
  if (titleLower.includes("routine") || titleLower.includes("morning")) {
    primaryTopic = "lifestyle";
  } else if (titleLower.includes("strategy") || titleLower.includes("guide") || titleLower.includes("tutorial")) {
    primaryTopic = "education";
  } else if (titleLower.includes("challenge") || titleLower.includes("trend")) {
    primaryTopic = "entertainment";
  } else if (titleLower.includes("product") || titleLower.includes("showcase")) {
    primaryTopic = "product";
  } else if (titleLower.includes("success") || titleLower.includes("story")) {
    primaryTopic = "inspiration";
  }
  
  // Secondary topics based on creative signals
  const secondaryTopics: string[] = [];
  if (asset.creativeSignals.emotionalTone === "informative") {
    secondaryTopics.push("educational");
  }
  if (asset.creativeSignals.emotionalTone === "entertaining") {
    secondaryTopics.push("entertainment");
  }
  if (asset.creativeSignals.emotionalTone === "inspiring") {
    secondaryTopics.push("inspiration");
  }
  
  // Confidence based on keyword match
  let confidence: "high" | "medium" | "low" = "low";
  if (keywords.length >= 3) {
    confidence = "high";
  } else if (keywords.length >= 1) {
    confidence = "medium";
  }
  
  return {
    assetId: asset.id,
    primaryTopic,
    secondaryTopics,
    extractedKeywords: keywords,
    confidence,
  };
}

