"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

// Dashboard sub-pages (under Content Dashboard)
const dashboardSubPages = [
  {
    title: "Content Overview",
    href: "/dashboard/content-overview",
  },
  {
    title: "Market Context",
    href: "/dashboard/market-context",
  },
  {
    title: "Measurement Insights",
    href: "/dashboard/measurement-insights",
  },
];

// Organic Intelligence sub-pages
const organicIntelligencePages = [
  {
    title: "Trend Intelligence (Market Observation)",
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
        {/* 1. Content Dashboard (Non-clickable header) */}
        {mainModules.slice(0, 1).map((module) => {
          const Icon = module.icon;
          const isActive = dashboardSubPages.some(page => pathname?.startsWith(page.href));
          return (
            <div
              key={module.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{module.title}</span>
            </div>
          );
        })}

        {/* 1.5. Dashboard Sub-pages */}
        <div className="pt-2">
          <div className="ml-8 mt-1 space-y-1">
            {dashboardSubPages.map((page) => {
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
        </div>

        {/* 2. Creative Performance Section */}
        <div className="pt-2">
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              isCreativePerformanceActive
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground"
            )}
          >
            <Palette className="h-5 w-5" />
            <span className="text-sm font-medium">Creative Performance</span>
          </div>
          
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
        </div>

        {/* 3. Ads Intelligence Section */}
        <div className="pt-2">
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              isAdsIntelligenceActive
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground"
            )}
          >
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-medium">Ads Intelligence</span>
          </div>
          
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
        </div>

        {/* 4. Organic Intelligence Section */}
        <div className="pt-2">
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              isOrganicIntelligenceActive
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground"
            )}
          >
            <Leaf className="h-5 w-5" />
            <span className="text-sm font-medium">Organic Intelligence</span>
          </div>
          
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
