import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CompetitorIntelligenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Competitor Intelligence</h1>
            <div className="flex gap-2">
              <Link href="/competitor-intelligence/overview">
                <Button variant="ghost">Overview</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
      <footer className="border-t mt-12 py-6">
        <div className="container mx-auto px-4">
          <p className="text-xs text-muted-foreground text-center">
            Competitor Intelligence provides external creative context.
            It does not measure effectiveness or performance.
          </p>
        </div>
      </footer>
    </div>
  );
}

