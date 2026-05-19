"use client";

import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieLabelRenderProps } from "recharts";

type Props = {
  data: { status: string; count: number }[];
};

const COLORS: Record<string, string> = {
  DRAFT: "#fbbf24",
  SENT: "#60a5fa",
  PAID: "#34d399",
  OVERDUE: "#f87171",
};

const renderLabel = (props: PieLabelRenderProps) => {
  const percent = props.percent ?? 0;
  const status = (props.payload as { status: string })?.status ?? "";
  return `${status} ${(percent * 100).toFixed(0)}%`;
};

function StatusChart({ data }: Props) {
  const dataWithColors = data.map((entry) => ({
    ...entry,
    fill: COLORS[entry.status] ?? "#e5e7eb",
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={dataWithColors}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={renderLabel}
            />
            <Tooltip formatter={(value) => [Number(value ?? 0), "Invoices"]} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default StatusChart;
