"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Payload } from "recharts/types/component/DefaultTooltipContent";
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";

export interface DataPoint {
  date: string;
  [key: string]: number | string; // For dynamic company data
}

// Add type for the tooltip payload
type TooltipPayload = Payload<number, string> & {
  color: string;
};

interface AreaChartProps {
  data: DataPoint[];
  title: string;
  description?: string;
  config: {
    [key: string]: {
      label: string;
      color: string;
      type?: "line" | "bar";
    };
  };
  dateRange?: string;
  trend?: {
    value: number;
    label: string;
  };
  xAxisKey?: string;
  xAxisFormatter?: (value: string) => string;
}

export function AreaChart({
  data,
  title,
  description,
  config,
  dateRange,
  trend,
  xAxisKey = "date",
  xAxisFormatter = (value) => value,
}: AreaChartProps) {
  // Check if we're using any bar type configs
  const hasBarType = Object.values(config).some((c) => c.type === "bar");

  const ChartComponent = hasBarType ? BarChart : RechartsAreaChart;

  return (
    <Card className="bg-transparent border-none">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                strokeOpacity={0.1}
                stroke="rgba(255,255,255,0.2)"
              />
              <XAxis
                dataKey={xAxisKey}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={xAxisFormatter}
                stroke="rgba(255,255,255,0.4)"
              />
              <YAxis
                domain={[0, "auto"]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke="rgba(255,255,255,0.4)"
              />
              <Tooltip
                cursor={hasBarType ? { fill: "rgba(255,255,255,0.1)" } : false}
                content={({ active, payload, label }) => {
                  if (!active || !payload) return null;
                  return (
                    <div className="rounded-lg border border-white/10 bg-gray-800/90 p-2 shadow-md backdrop-blur-md">
                      <div className="text-sm text-white">
                        {xAxisFormatter(label)}
                      </div>
                      {(payload as TooltipPayload[]).map((entry, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-white">{entry.name}:</span>
                          <span className="text-white">
                            {Number(entry.value).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
              <Legend wrapperStyle={{ color: "white" }} />
              {Object.entries(config).map(([key, value]) =>
                value.type === "bar" ? (
                  <Bar
                    key={key}
                    dataKey={key}
                    name={value.label}
                    fill={value.color}
                    radius={[4, 4, 0, 0]}
                  />
                ) : (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    name={value.label}
                    stroke={value.color}
                    fill={value.color}
                    fillOpacity={0.1}
                    strokeWidth={2}
                    connectNulls
                  />
                ),
              )}
            </ChartComponent>
          </ResponsiveContainer>
        </div>
      </CardContent>
      {(trend || dateRange) && (
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              {trend && (
                <div className="flex items-center gap-2 font-medium leading-none text-white">
                  {trend.label}{" "}
                  {trend.value > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  )}
                </div>
              )}
              {dateRange && (
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  {dateRange}
                </div>
              )}
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
