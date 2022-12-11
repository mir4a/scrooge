import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

export interface ExpenseIncomeBarChartProps {
  data: any[];
}

export default function ExpenseIncomeBarChart({
  data,
}: ExpenseIncomeBarChartProps) {
  const dataNormalized = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString(),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={dataNormalized}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="_sum.value" name="transaction amount">
          {dataNormalized.map((entry, index) => {
            const color = entry._sum.value > 0 ? "#48bb78" : "#f56565";
            return <Cell key={`cell-${index}`} fill={color} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
