import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdsIntelligenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Ads Intelligence</h1>
            <div className="flex gap-2">
              <Link href="/ads-intelligence/overview">
                <Button variant="ghost">Overview</Button>
              </Link>
              <Link href="/ads-intelligence/insights">
                <Button variant="ghost">Insights</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

