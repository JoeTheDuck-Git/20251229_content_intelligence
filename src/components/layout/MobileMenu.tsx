"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  TrendingUp, 
  AlertTriangle, 
  Network, 
  Lightbulb,
  Leaf,
  TrendingDown,
  Play,
  Users,
  Menu,
  X,
  Palette,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const modules = [
  {
    title: "Content Dashboard",
    href: "/dashboard/content-overview",
    icon: LayoutDashboard,
  },
  {
    title: "Ads Intelligence",
    href: "/ads-intelligence/overview",
    icon: TrendingUp,
  },
  {
    title: "Fatigue Intelligence",
    href: "/ads-fatigue/overview",
    icon: AlertTriangle,
  },
  {
    title: "Creative Clusters",
    href: "/creative-clusters/overview",
    icon: Network,
  },
  {
    title: "Strategy Feedback",
    href: "/strategy-feedback/overview",
    icon: Lightbulb,
  },
  {
    title: "Organic Intelligence",
    href: "/organic-intelligence/overview",
    icon: Leaf,
  },
  {
    title: "Trend Intelligence",
    href: "/trend-intelligence/overview",
    icon: TrendingDown,
  },
  {
    title: "YouTube Intelligence",
    href: "/youtube-intelligence/overview",
    icon: Play,
  },
  {
    title: "Competitor Intelligence",
    href: "/competitor-intelligence/overview",
    icon: Users,
  },
];

// Creative Performance sub-pages
const creativePerformancePages = [
  {
    title: "Cross-Format Overview",
    href: "/dashboard/creative-overview",
  },
  {
    title: "Paid Creative Performance",
    href: "/ads/creative-performance",
  },
  {
    title: "Organic Creative Performance",
    href: "/organic/creative-performance",
  },
];

export function MobileMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCreativePerformanceOpen, setIsCreativePerformanceOpen] = useState(false);

  return (
    <header className="border-b md:hidden">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Content Intelligence OS
          </Link>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t mt-4 pt-4 space-y-1">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Link
                  key={module.href}
                  href={module.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                >
                  <Icon className="h-5 w-5" />
                  <span>{module.title}</span>
                </Link>
              );
            })}

            {/* Creative Performance Section */}
            <div className="pt-2">
              <button
                onClick={() => setIsCreativePerformanceOpen(!isCreativePerformanceOpen)}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
              >
                <Palette className="h-5 w-5" />
                <span className="flex-1 text-left">Creative Performance</span>
                {isCreativePerformanceOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              
              {isCreativePerformanceOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  {creativePerformancePages.map((page) => (
                    <Link
                      key={page.href}
                      href={page.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded-md text-muted-foreground"
                    >
                      <span>{page.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

