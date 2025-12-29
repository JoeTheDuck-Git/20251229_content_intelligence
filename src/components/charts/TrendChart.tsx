"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdsMetrics } from "@/types";

interface TrendChartProps {
  data: AdsMetrics[];
  metric: "ctr" | "roas" | "spend";
}

export function TrendChart({ data, metric }: TrendChartProps) {
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    [metric]: item[metric],
  }));

  const metricLabels = {
    ctr: "CTR (%)",
    roas: "ROAS",
    spend: "Spend ($)",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{metricLabels[metric]} Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={metric} stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

