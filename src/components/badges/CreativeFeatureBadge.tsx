import { Badge } from "@/components/ui/badge";
import { CreativeFeatures } from "@/types";

interface CreativeFeatureBadgeProps {
  features: CreativeFeatures;
}

export function CreativeFeatureBadge({ features }: CreativeFeatureBadgeProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline">{features.hookType}</Badge>
      <Badge variant="outline">{features.pacing}</Badge>
      <Badge variant="outline">{features.voiceType}</Badge>
    </div>
  );
}

