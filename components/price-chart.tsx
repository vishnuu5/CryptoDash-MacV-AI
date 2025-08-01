"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import type { ChartData } from "@/types/coin";

interface PriceChartProps {
  data: ChartData[];
  loading: boolean;
}

export function PriceChart({ data, loading }: PriceChartProps) {
  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="h-[400px] flex items-center justify-center text-muted-foreground">
        No chart data available
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: data.length <= 24 ? "numeric" : undefined,
    });
  };

  const minPrice = Math.min(...data.map((d) => d.price));
  const maxPrice = Math.max(...data.map((d) => d.price));
  const priceChange = data[data.length - 1]?.price - data[0]?.price;
  const lineColor = priceChange >= 0 ? "#16a34a" : "#dc2626";

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatDate}
            axisLine={false}
            tickLine={false}
            className="text-xs"
          />
          <YAxis
            domain={[minPrice * 0.99, maxPrice * 1.01]}
            tickFormatter={(value) => formatCurrency(value, true)}
            axisLine={false}
            tickLine={false}
            className="text-xs"
          />
          <Tooltip
            labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
            formatter={(value: number) => [formatCurrency(value), "Price"]}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={lineColor}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: lineColor }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
