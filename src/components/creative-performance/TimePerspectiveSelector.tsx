"use client";

import { Button } from "@/components/ui/button";
import { TimePerspective } from "@/types/creative-performance";

interface TimePerspectiveSelectorProps {
  value: TimePerspective;
  onChange: (value: TimePerspective) => void;
}

export function TimePerspectiveSelector({ value, onChange }: TimePerspectiveSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-end gap-2">
        <span className="text-sm text-muted-foreground">Time Perspective:</span>
        <div className="flex gap-1 border rounded-md p-1 bg-background">
          <Button
            type="button"
            variant={value === "Recent" ? "default" : "ghost"}
            size="sm"
            onClick={() => onChange("Recent")}
            className="h-8 px-3 text-xs"
          >
            Recent
          </Button>
          <Button
            type="button"
            variant={value === "MidTerm" ? "default" : "ghost"}
            size="sm"
            onClick={() => onChange("MidTerm")}
            className="h-8 px-3 text-xs"
          >
            Mid-Term
          </Button>
          <Button
            type="button"
            variant={value === "Baseline" ? "default" : "ghost"}
            size="sm"
            onClick={() => onChange("Baseline")}
            className="h-8 px-3 text-xs"
          >
            Baseline
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-right max-w-md ml-auto">
        Time perspective influences how creative patterns are interpreted. It does not affect strategic recommendations.
      </p>
    </div>
  );
}

