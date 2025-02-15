"use client";

import { type ReactNode } from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";

export type ChartConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};

interface ChartContainerProps {
  config: ChartConfig;
  children: ReactNode;
}

export function ChartContainer({ children, config }: ChartContainerProps) {
  return (
    <div
      className="h-[300px] w-full"
      style={
        {
          ...Object.entries(config).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [`--color-${key}`]: value.color,
            }),
            {},
          ),
        } as React.CSSProperties
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

interface ChartTooltipContentProps
  extends Omit<TooltipProps<any, any>, "active" | "payload"> {
  active?: boolean;
  payload?: any[];
  indicator?: "dot" | "line";
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  indicator = "dot",
}: ChartTooltipContentProps) {
  if (!active || !payload) return null;

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
        <div className="grid gap-1">
          {payload.map((value: any, i: number) => (
            <div key={i} className="flex items-center gap-2">
              {indicator === "dot" && (
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ background: value.color }}
                />
              )}
              {indicator === "line" && (
                <div
                  className="h-1 w-4 rounded-full"
                  style={{ background: value.color }}
                />
              )}
              <span className="text-sm font-medium">
                {value.name}: {value.value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const ChartTooltip = Tooltip;
