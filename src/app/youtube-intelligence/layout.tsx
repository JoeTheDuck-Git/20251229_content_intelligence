import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function YouTubeIntelligenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">YouTube Intelligence</h1>
            <div className="flex gap-2">
              <Link href="/youtube-intelligence/overview">
                <Button variant="ghost">Overview</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

