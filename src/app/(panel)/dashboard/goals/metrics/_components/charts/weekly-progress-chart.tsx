"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface WeeklyProgressChartProps {
  data: {
    week: string;
    completed: number;
    total: number;
  }[];
}

export function WeeklyProgressChart({ data }: WeeklyProgressChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="week" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          contentStyle={{ backgroundColor: "#27272a", border: "none", borderRadius: "8px" }}
          labelStyle={{ color: "#fff" }}
        />
        <Bar
          dataKey="completed"
          fill="#adfa1d"
          radius={[4, 4, 0, 0]}
          name="Completas"
          cursor="pointer"
          activeBar={{ fill: "#82b317" }}
        />
        <Bar
          dataKey="total"
          fill="#1d2afa"
          radius={[4, 4, 0, 0]}
          name="Total"
          cursor="pointer"
          activeBar={{ fill: "#1722c6" }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
