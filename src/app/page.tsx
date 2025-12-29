"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3,
  Target,
  Sparkles,
  Network,
  AlertTriangle,
} from "lucide-react";

const benefits = [
  {
    title: "Creative Clustering & Pattern Discovery",
    description: "Group similar creatives to discover patterns and scale what works",
    icon: Network,
  },
  {
    title: "Fatigue Detection & Refresh Suggestions",
    description: "Spot creative fatigue early and refresh before performance declines",
    icon: AlertTriangle,
  },
  {
    title: "Channel-Aware Insights",
    description: "Understand platform-native behavior and optimize for Paid + Organic channels",
    icon: Target,
  },
  {
    title: "Measurement-Driven Prioritization",
    description: "Identify what drives content and ad performance across channels",
    icon: BarChart3,
  },
  {
    title: "Export-Ready Insights for Teams",
    description: "Receive actionable recommendations powered by performance intelligence",
    icon: Sparkles,
  },
];

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Content × Ads × Measurement Intelligence
          </h1>
          <p className="text-muted-foreground mt-2 text-lg max-w-2xl mx-auto">
            Unify your content strategy with AI-powered insights across organic and paid channels. 
            Diagnose performance, detect fatigue, and scale what works.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard/content-overview">
              <Button size="lg">Open Content Dashboard</Button>
            </Link>
            <Link href="#benefits">
              <Button size="lg" variant="outline">Explore Modules</Button>
            </Link>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">What You Get</h2>
            <p className="text-muted-foreground mb-6">
              Powerful capabilities to transform your content strategy
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{benefit.title}</CardTitle>
                    </div>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t pt-8 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="font-semibold">Content Intelligence OS</p>
              <p className="text-sm text-muted-foreground mt-1">
                AI SaaS for Content × Ads × Measurement Intelligence
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs text-muted-foreground">
                Demo environment • All data is simulated
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
