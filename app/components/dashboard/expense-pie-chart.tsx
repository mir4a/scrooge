import React from "react";
import { Pie, PieChart, Tooltip } from "recharts";

export interface ExpensePieChartProps {
  data: any[];
  categories: any[];
}

let isHydrating = true;

export const ExpensePieChart = (props: ExpensePieChartProps) => {
  const { data, categories } = props;
  const [isHydrated, setIsHydrated] = React.useState(!isHydrating);

  React.useEffect(() => {
    isHydrating = false;
    setIsHydrated(true);
  }, []);

  const categoriesMap = categories.reduce((acc, category) => {
    acc[category.id] = category;
    return acc;
  }, {});

  console.log(data);

  const chartData = data.map((record) => ({
    name: record.categoryId
      ? categoriesMap[record.categoryId].name
      : "Uncategorized",
    value: Math.abs(record._sum.value),
    fill: record.categoryId
      ? categoriesMap[record.categoryId].color
      : "#dedede",
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
