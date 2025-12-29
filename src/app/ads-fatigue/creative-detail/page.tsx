"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getMetricsByAssetId } from "@/lib/fatigue-intelligence/get-fatigue-data";
import { analyzeFatigue } from "@/lib/fatigue-intelligence/analyze-fatigue";
import { FatigueAnalysis, AdsMetric } from "@/types/fatigue";
import { FatigueExplanationCard } from "@/components/cards/FatigueExplanationCard";
import { FatigueSignalCard } from "@/components/cards/FatigueSignalCard";
import { PerformanceMetricCard } from "@/components/cards/PerformanceMetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function CreativeDetailPage() {
  const searchParams = useSearchParams();
  const assetId = searchParams.get("assetId") || "";
  const [analysis, setAnalysis] = useState<FatigueAnalysis | null>(null);
  const [metrics, setMetrics] = useState<AdsMetric[]>([]);

  useEffect(() => {
    if (assetId) {
      const metricsData = getMetricsByAssetId(assetId);
      setMetrics(metricsData);
      const analysisData = analyzeFatigue(assetId, metricsData);
      setAnalysis(analysisData);
    }
  }, [assetId]);

  if (!analysis || metrics.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please select a creative to analyze</p>
      </div>
    );
  }

  const latest = metrics[metrics.length - 1];
  const detectedSignals = analysis.signals.filter((s) => s.detected);

  // Convert AdsMetric to format expected by charts
  const chartData = metrics.map((m) => ({
    date: new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    ctr: m.ctr,
    roas: m.roas,
    frequency: m.frequency,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Creative Fatigue Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Detailed fatigue intelligence for Creative {assetId}
        </p>
      </div>

      <FatigueExplanationCard analysis={analysis} />

      <div className="grid gap-4 md:grid-cols-4">
        <PerformanceMetricCard
          title="Current CTR"
          value={formatPercentage(latest.ctr)}
          trend={
            analysis.metrics.ctrTrend === "improving"
              ? "up"
              : analysis.metrics.ctrTrend === "declining"
              ? "down"
              : "neutral"
          }
        />
        <PerformanceMetricCard
          title="Current ROAS"
          value={`${latest.roas.toFixed(1)}x`}
          trend={
            analysis.metrics.roasTrend === "improving"
              ? "up"
              : analysis.metrics.roasTrend === "declining"
              ? "down"
              : "neutral"
          }
        />
        <PerformanceMetricCard
          title="Frequency"
          value={latest.frequency.toFixed(1)}
          trend={
            analysis.metrics.frequencyTrend === "increasing"
              ? "up"
              : analysis.metrics.frequencyTrend === "decreasing"
              ? "down"
              : "neutral"
          }
        />
        <PerformanceMetricCard
          title="Total Spend"
          value={formatCurrency(analysis.metrics.totalSpend)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>CTR Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ctr" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ROAS Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="roas" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Detected Fatigue Signals</h2>
        {detectedSignals.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {detectedSignals.map((signal) => (
              <FatigueSignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No fatigue signals detected. Creative is performing well.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">All Signals</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {analysis.signals.map((signal) => (
            <FatigueSignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      </div>
    </div>
  );
}

