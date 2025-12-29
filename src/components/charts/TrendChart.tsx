"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdsMetrics } from "@/types";

// 通用時間序列數據格式
interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

// 支援兩種使用方式
type TrendChartProps =
  | {
      data: AdsMetrics[];
      metric: "ctr" | "roas" | "spend";
      title?: string;
    }
  | {
      data: TimeSeriesData[];
      metric?: never;
      title?: string;
    };

export function TrendChart(props: TrendChartProps) {
  const { data, title } = props;
  const metric = "metric" in props ? props.metric : undefined;

  // 判斷數據格式並轉換
  const chartData =
    metric && data.length > 0 && "assetId" in (data[0] || {})
      ? // AdsMetrics 格式
        (data as AdsMetrics[]).map((item) => ({
          date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          [metric]: item[metric],
        }))
      : // 通用時間序列格式
        (data as TimeSeriesData[]).map((item) => ({
          date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          value: item.value,
        }));

  const metricLabels = {
    ctr: "CTR (%)",
    roas: "ROAS",
    spend: "Spend ($)",
  };

  const chartTitle = title || (metric ? metricLabels[metric] + " Trend" : "Trend");
  const dataKey = metric || "value";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{chartTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={dataKey} stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

