import React from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

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

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    // const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    // const sx = cx + (outerRadius + 10) * cos;
    // const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;

    return (
      <text
        x={ex + (cos >= 0 ? 1 : -1)}
        y={ey}
        fill="#000"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart id="expense-chart">
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          label={renderCustomizedLabel}
        >
          {/* <LabelList
          // dataKey="name"
          position="outside"
          fill="red"
          content={(_props) => {
            console.log(_props);
            return (
              <g>
                <text
                  x={_props.x + _props.width / 2}
                  y={_props.y}
                  fill={_props.fill}
                  textAnchor={_props.textAnchor}
                  dominantBaseline="central"
                >
                  {_props.name}
                </text>
              </g>
            );
          }}
        />
        <Label fill="#000" value="some" position="outside" /> */}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};
