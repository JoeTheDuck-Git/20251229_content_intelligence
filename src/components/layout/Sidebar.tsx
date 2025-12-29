"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  Palette,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// 主要模組（不含子項目的）
const mainModules = [
  {
    title: "Content Dashboard",
    href: "/dashboard/content-overview",
    icon: LayoutDashboard,
  },
  {
    title: "Competitor Intelligence",
    href: "/competitor-intelligence/overview",
    icon: Users,
  },
  {
    title: "Strategy Feedback",
    href: "/strategy-feedback/overview",
    icon: Lightbulb,
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

// Ads Intelligence sub-pages
const adsIntelligencePages = [
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
];

// Organic Intelligence sub-pages
const organicIntelligencePages = [
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
];

export function Sidebar() {
  const pathname = usePathname();
  
  // Creative Performance 展開狀態
  const [isCreativePerformanceOpen, setIsCreativePerformanceOpen] = useState(() => {
    return creativePerformancePages.some(page => pathname?.startsWith(page.href));
  });

  // Ads Intelligence 展開狀態
  const [isAdsIntelligenceOpen, setIsAdsIntelligenceOpen] = useState(() => {
    return adsIntelligencePages.some(page => pathname?.startsWith(page.href)) ||
           pathname?.startsWith("/ads-intelligence");
  });

  // Organic Intelligence 展開狀態
  const [isOrganicIntelligenceOpen, setIsOrganicIntelligenceOpen] = useState(() => {
    return organicIntelligencePages.some(page => pathname?.startsWith(page.href)) ||
           pathname?.startsWith("/organic-intelligence");
  });

  const isCreativePerformanceActive = creativePerformancePages.some(
    page => pathname?.startsWith(page.href)
  );

  const isAdsIntelligenceActive = adsIntelligencePages.some(
    page => pathname?.startsWith(page.href)
  ) || pathname?.startsWith("/ads-intelligence");

  const isOrganicIntelligenceActive = organicIntelligencePages.some(
    page => pathname?.startsWith(page.href)
  ) || pathname?.startsWith("/organic-intelligence");

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-background fixed left-0 top-0 h-screen overflow-y-auto z-50">
      <div className="p-4 border-b">
        <Link href="/" className="text-xl font-bold">
          Content Intelligence OS
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {/* 1. Content Dashboard */}
        {mainModules.slice(0, 1).map((module) => {
          const Icon = module.icon;
          const isActive = pathname?.startsWith(module.href);
          return (
            <Link
              key={module.href}
              href={module.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{module.title}</span>
            </Link>
          );
        })}

        {/* 2. Creative Performance Section */}
        <div className="pt-2">
          <button
            onClick={() => setIsCreativePerformanceOpen(!isCreativePerformanceOpen)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              isCreativePerformanceActive
                ? "bg-accent text-accent-foreground font-medium"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Palette className="h-5 w-5" />
            <span className="text-sm font-medium flex-1 text-left">Creative Performance</span>
            {isCreativePerformanceOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {isCreativePerformanceOpen && (
            <div className="ml-8 mt-1 space-y-1">
              {creativePerformancePages.map((page) => {
                const isActive = pathname?.startsWith(page.href);
                return (
                  <Link
                    key={page.href}
                    href={page.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-sm",
                      isActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                    )}
                  >
                    <span>{page.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Ads Intelligence Section */}
        <div className="pt-2">
          <button
            onClick={() => setIsAdsIntelligenceOpen(!isAdsIntelligenceOpen)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              isAdsIntelligenceActive
                ? "bg-accent text-accent-foreground font-medium"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-medium flex-1 text-left">Ads Intelligence</span>
            {isAdsIntelligenceOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {isAdsIntelligenceOpen && (
            <div className="ml-8 mt-1 space-y-1">
              <Link
                href="/ads-intelligence/overview"
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-sm",
                  pathname?.startsWith("/ads-intelligence/overview")
                    ? "bg-accent text-accent-foreground font-medium"
                    : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                )}
              >
                <span>Overview</span>
              </Link>
              {adsIntelligencePages.map((page) => {
                const Icon = page.icon;
                const isActive = pathname?.startsWith(page.href);
                return (
                  <Link
                    key={page.href}
                    href={page.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-sm",
                      isActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{page.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Organic Intelligence Section */}
        <div className="pt-2">
          <button
            onClick={() => setIsOrganicIntelligenceOpen(!isOrganicIntelligenceOpen)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              isOrganicIntelligenceActive
                ? "bg-accent text-accent-foreground font-medium"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Leaf className="h-5 w-5" />
            <span className="text-sm font-medium flex-1 text-left">Organic Intelligence</span>
            {isOrganicIntelligenceOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {isOrganicIntelligenceOpen && (
            <div className="ml-8 mt-1 space-y-1">
              <Link
                href="/organic-intelligence/overview"
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-sm",
                  pathname?.startsWith("/organic-intelligence/overview")
                    ? "bg-accent text-accent-foreground font-medium"
                    : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                )}
              >
                <span>Overview</span>
              </Link>
              {organicIntelligencePages.map((page) => {
                const Icon = page.icon;
                const isActive = pathname?.startsWith(page.href);
                return (
                  <Link
                    key={page.href}
                    href={page.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-sm",
                      isActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{page.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. Competitor Intelligence */}
        {mainModules.slice(1, 2).map((module) => {
          const Icon = module.icon;
          const isActive = pathname?.startsWith(module.href);
          return (
            <Link
              key={module.href}
              href={module.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{module.title}</span>
            </Link>
          );
        })}

        {/* 6. Strategy Feedback */}
        {mainModules.slice(2, 3).map((module) => {
          const Icon = module.icon;
          const isActive = pathname?.startsWith(module.href);
          return (
            <Link
              key={module.href}
              href={module.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{module.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
