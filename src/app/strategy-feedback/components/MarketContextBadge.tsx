import { Badge } from "@/components/ui/badge";

interface MarketContextBadgeProps {
  context: "Crowded Market" | "Differentiated" | "Market Neutral";
}

export function MarketContextBadge({ context }: MarketContextBadgeProps) {
  const variant = 
    context === "Crowded Market" ? "warning" :
    context === "Differentiated" ? "success" : "secondary";
  
  return (
    <Badge variant={variant} className="text-xs">
      {context}
    </Badge>
  );
}

