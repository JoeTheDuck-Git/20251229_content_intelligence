import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionPlaybook } from "@/types/strategy";
import { CheckCircle2 } from "lucide-react";

interface PlaybookCardProps {
  playbook: ActionPlaybook;
}

export function PlaybookCard({ playbook }: PlaybookCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{playbook.title}</CardTitle>
        <CardDescription>{playbook.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Applicable Scenarios</p>
          <div className="flex flex-wrap gap-2">
            {playbook.applicableScenarios.map((scenario, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {scenario}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium mb-2">Steps</p>
          <ol className="space-y-2">
            {playbook.steps.map((step, idx) => (
              <li key={idx} className="text-sm flex items-start gap-2">
                <span className="font-medium text-muted-foreground">{idx + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="pt-2 border-t">
          <p className="text-sm font-medium mb-1">Expected Outcome</p>
          <p className="text-sm text-muted-foreground">{playbook.expectedOutcome}</p>
        </div>
      </CardContent>
    </Card>
  );
}

