import React from "react";
import { Pie, PieChart, Tooltip } from "recharts";

export interface ExpenseChartProps {
  data: any[];
}

let isHydrating = true;

export const ExpenseChart = (props: ExpenseChartProps) => {
  const { data } = props;
  const [isHydrated, setIsHydrated] = React.useState(!isHydrating);

  React.useEffect(() => {
    isHydrating = false;
    setIsHydrated(true);
  }, []);

  console.log(data);

  const chartData = data.map((record) => ({
    name: record.categoryId ? record.categoryId : "Uncategorized",
    value: Math.abs(record._sum.value),
    // fill: record.categoryId ? record.category.color : "#000",
  }));

  console.log(chartData);

  if (!isHydrated) {
    return null;
  }

  return (
    <PieChart width={400} height={400} id="expense-chart">
      <Pie
        data={chartData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        // fill="#8884d8"
        label
      />
      <Tooltip />
    </PieChart>
  );
};
