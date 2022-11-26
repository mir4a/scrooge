import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface ExpenseIncomeBarChartProps {
  data: any[];
}

export default function ExpenseIncomeBarChart({
  data,
}: ExpenseIncomeBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
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
        <Bar dataKey="_sum.value" name="transaction amount" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
