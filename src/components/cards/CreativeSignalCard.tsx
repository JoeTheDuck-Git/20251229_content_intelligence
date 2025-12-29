import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrganicContentAsset } from "@/types/organic";
import { extractCreativeSignals } from "@/lib/organic/creative-signals/signal-extractor";

interface CreativeSignalCardProps {
  asset: OrganicContentAsset;
}

export function CreativeSignalCard({ asset }: CreativeSignalCardProps) {
  const signals = extractCreativeSignals(asset);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Creative Signals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Hook Style</p>
          <Badge variant="outline">{signals.hookCategory}</Badge>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Visual Focus</p>
          <Badge variant="outline">{signals.visualDominance}</Badge>
        </div>
        {signals.pacingCategory !== "unknown" && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Pacing</p>
            <Badge variant="outline">{signals.pacingCategory}</Badge>
          </div>
        )}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Emotional Tone</p>
          <Badge variant="outline">{signals.toneCategory}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

