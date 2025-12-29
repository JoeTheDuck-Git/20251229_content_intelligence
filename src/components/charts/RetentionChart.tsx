"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { RetentionDataPoint } from "@/types/youtube";

interface RetentionChartProps {
  data: RetentionDataPoint[];
  narrativeSegments?: Array<{ startSecond: number; endSecond: number; segmentType: string }>;
}

export function RetentionChart({ data, narrativeSegments }: RetentionChartProps) {
  const chartData = data.map(point => ({
    second: point.second,
    retention: point.retentionRate,
  }));
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="second" 
          label={{ value: "Time (seconds)", position: "insideBottom", offset: -5 }}
        />
        <YAxis 
          label={{ value: "Retention (%)", angle: -90, position: "insideLeft" }}
          domain={[0, 100]}
        />
        <Tooltip 
          formatter={(value: number) => [`${value.toFixed(1)}%`, "Retention"]}
          labelFormatter={(label) => `Time: ${label}s`}
        />
        <Line 
          type="monotone" 
          dataKey="retention" 
          stroke="#3b82f6" 
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

