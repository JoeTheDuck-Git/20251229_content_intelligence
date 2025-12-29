import { Badge } from "@/components/ui/badge";
import { StrengthLevel, FormatType } from "@/types/creative-performance";
import { Video, Image, FileText } from "lucide-react";

interface FormatStrengthIndicatorProps {
  format: FormatType;
  strength: StrengthLevel;
  stability?: "consistent" | "volatile";
}

const formatIcons = {
  video: Video,
  image: Image,
  text: FileText,
};

const strengthColors = {
  strong: "bg-green-100 text-green-800 border-green-300",
  mixed: "bg-yellow-100 text-yellow-800 border-yellow-300",
  weak: "bg-gray-100 text-gray-800 border-gray-300",
};

export function FormatStrengthIndicator({
  format,
  strength,
  stability,
}: FormatStrengthIndicatorProps) {
  const Icon = formatIcons[format];

  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <Badge
        variant="outline"
        className={strengthColors[strength]}
      >
        {strength.charAt(0).toUpperCase() + strength.slice(1)}
      </Badge>
      {stability && (
        <span className="text-xs text-muted-foreground">
          {stability === "consistent" ? "✓" : "~"}
        </span>
      )}
    </div>
  );
}

