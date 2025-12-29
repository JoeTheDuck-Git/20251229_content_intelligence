"use client";

import { actionPlaybooks } from "@/lib/strategy-engine/action-playbooks";
import { PlaybookCard } from "@/components/cards/PlaybookCard";

export default function ActionPlaybooksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Action Playbooks</h1>
        <p className="text-muted-foreground mt-2">
          Predefined, readable playbooks for common strategy scenarios
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {actionPlaybooks.map((playbook) => (
          <PlaybookCard key={playbook.id} playbook={playbook} />
        ))}
      </div>
    </div>
  );
}

