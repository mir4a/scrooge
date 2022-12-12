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
  onRangeChange?: (range: { start: Date; end: Date }) => void;
}

export default function ExpenseIncomeBarChart({
  data,
  onRangeChange,
}: ExpenseIncomeBarChartProps) {
  const [startDate, setStartDate] = React.useState<Date>();

  const dataNormalized = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString(),
    originalDate: item.date,
  }));

  const handleMouseDown = (e: any, s: any) => {
    const originalDate = e.activePayload[0].payload.originalDate;
    setStartDate(new Date(originalDate));
  };

  const handleMouseUp = (e: any, s: any) => {
    const originalDate = e.activePayload[0].payload.originalDate;
    const endDate = new Date(originalDate);

    if (startDate) {
      if (startDate.getTime() > endDate.getTime()) {
        onRangeChange?.({ start: endDate, end: startDate });
      } else {
        onRangeChange?.({ start: startDate, end: endDate });
      }
    }
  };

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
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
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
