"use client";

import { useState } from "react";
import { getAllAssetIds, getLatestMetric, getMetricsByAssetId } from "@/lib/fatigue-intelligence/get-fatigue-data";
import { analyzeFatigue } from "@/lib/fatigue-intelligence/analyze-fatigue";
import { FatigueStatusCard } from "@/components/cards/FatigueStatusCard";
import Link from "next/link";

export default function FatigueOverviewPage() {
  const assetIds = getAllAssetIds();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Creative Fatigue Overview</h1>
        <p className="text-muted-foreground mt-2">
          Monitor fatigue status across all your ad creatives
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assetIds.map((assetId) => {
          const metrics = getMetricsByAssetId(assetId);
          const latest = getLatestMetric(assetId);
          const analysis = analyzeFatigue(assetId, metrics);

          if (!latest) return null;

          return (
            <Link key={assetId} href={`/ads-fatigue/creative-detail?assetId=${assetId}`}>
              <FatigueStatusCard
                assetId={assetId}
                status={analysis.status}
                ctr={latest.ctr}
                roas={latest.roas}
                frequency={latest.frequency}
                spend={analysis.metrics.totalSpend}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

