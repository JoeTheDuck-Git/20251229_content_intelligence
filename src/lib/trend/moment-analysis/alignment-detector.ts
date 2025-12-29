import { OrganicContentAsset } from "@/types/organic";
import { MomentContext, MomentAlignmentResult } from "@/types/trend";
import { extractTopics } from "../topic-tagging/topic-extractor";

export function detectMomentAlignment(
  asset: OrganicContentAsset,
  moment: MomentContext
): MomentAlignmentResult {
  const topicTag = extractTopics(asset);
  const publishDate = new Date(asset.publishDate);
  const momentStart = new Date(moment.startDate);
  const momentEnd = new Date(moment.endDate);
  
  // Check if publish date is within moment window
  const isWithinWindow = publishDate >= momentStart && publishDate <= momentEnd;
  
  // Calculate timing score (0-10)
  let timingScore = 0;
  if (isWithinWindow) {
    // Closer to start = higher score (early momentum)
    const totalDuration = momentEnd.getTime() - momentStart.getTime();
    const timeFromStart = publishDate.getTime() - momentStart.getTime();
    const timingRatio = 1 - (timeFromStart / totalDuration);
    timingScore = timingRatio * 10;
  } else {
    // Outside window = lower score
    const daysBefore = (momentStart.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24);
    const daysAfter = (publishDate.getTime() - momentEnd.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysBefore > 0 && daysBefore <= 7) {
      timingScore = 3; // Slightly early
    } else if (daysAfter > 0 && daysAfter <= 7) {
      timingScore = 2; // Slightly late
    } else {
      timingScore = 0;
    }
  }
  
  // Calculate topic relevance score (0-10)
  let topicRelevanceScore = 0;
  const assetKeywords = topicTag.extractedKeywords.map(k => k.toLowerCase());
  const momentKeywords = (moment.relatedKeywords || []).map(k => k.toLowerCase());
  
  // Count keyword matches
  const matches = assetKeywords.filter(k => 
    momentKeywords.some(mk => mk.includes(k) || k.includes(mk))
  ).length;
  
  // Check primary topic alignment
  const primaryTopicMatch = momentKeywords.some(k => 
    topicTag.primaryTopic.toLowerCase().includes(k) || 
    k.includes(topicTag.primaryTopic.toLowerCase())
  );
  
  if (primaryTopicMatch) {
    topicRelevanceScore += 5;
  }
  
  topicRelevanceScore += Math.min(5, matches * 1.5);
  topicRelevanceScore = Math.min(10, topicRelevanceScore);
  
  // Determine alignment strength
  let alignmentStrength: "none" | "weak" | "strong" = "none";
  const combinedScore = (timingScore + topicRelevanceScore) / 2;
  
  if (combinedScore >= 7 && isWithinWindow) {
    alignmentStrength = "strong";
  } else if (combinedScore >= 4) {
    alignmentStrength = "weak";
  }
  
  // Estimate amplification impact
  let amplificationImpact: "low" | "medium" | "high" = "low";
  if (alignmentStrength === "strong" && moment.intensityLevel === "high") {
    amplificationImpact = "high";
  } else if (alignmentStrength === "strong" || (alignmentStrength === "weak" && moment.intensityLevel === "high")) {
    amplificationImpact = "medium";
  }
  
  // Estimate uplift percentage
  let estimatedUplift: number | undefined;
  if (amplificationImpact === "high") {
    estimatedUplift = 50 + (combinedScore - 7) * 10; // 50-80%
  } else if (amplificationImpact === "medium") {
    estimatedUplift = 20 + (combinedScore - 4) * 10; // 20-50%
  } else if (amplificationImpact === "low" && combinedScore > 2) {
    estimatedUplift = 5 + (combinedScore - 2) * 5; // 5-20%
  }
  
  return {
    assetId: asset.id,
    momentId: moment.id,
    alignmentStrength,
    amplificationImpact,
    timingScore,
    topicRelevanceScore,
    estimatedUplift,
  };
}

export function findAlignedMoments(
  asset: OrganicContentAsset,
  moments: MomentContext[]
): MomentAlignmentResult[] {
  return moments
    .map(moment => detectMomentAlignment(asset, moment))
    .filter(result => result.alignmentStrength !== "none")
    .sort((a, b) => {
      const scoreA = (a.timingScore + a.topicRelevanceScore) / 2;
      const scoreB = (b.timingScore + b.topicRelevanceScore) / 2;
      return scoreB - scoreA;
    });
}

