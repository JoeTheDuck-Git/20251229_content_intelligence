import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PortfolioCategory } from "@/lib/content-overview/portfolio-classifier";

interface PortfolioCategoryCardProps {
  category: PortfolioCategory;
  count: number;
  description: string;
}

const categoryLabels: Record<PortfolioCategory, string> = {
  "organic-first": "Organic-First Assets",
  "paid-first": "Paid-First Assets",
  "dual-use": "Dual-Use Assets",
  "moment-only": "Moment-Only Assets",
};

const categoryColors: Record<PortfolioCategory, string> = {
  "organic-first": "bg-green-50 border-green-200",
  "paid-first": "bg-blue-50 border-blue-200",
  "dual-use": "bg-purple-50 border-purple-200",
  "moment-only": "bg-orange-50 border-orange-200",
};

export function PortfolioCategoryCard({
  category,
  count,
  description,
}: PortfolioCategoryCardProps) {
  return (
    <Card className={categoryColors[category]}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{categoryLabels[category]}</CardTitle>
          <Badge variant="outline" className="text-2xl font-bold">
            {count}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

