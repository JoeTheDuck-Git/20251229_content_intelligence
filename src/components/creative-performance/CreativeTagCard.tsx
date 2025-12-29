import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface CreativeTagCardProps {
  tagName: string;
  category: string;
  children?: React.ReactNode;
}

export function CreativeTagCard({
  tagName,
  category,
  children,
}: CreativeTagCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base font-medium">{tagName}</CardTitle>
          <Badge variant="outline" className="ml-auto text-xs">
            {category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}

