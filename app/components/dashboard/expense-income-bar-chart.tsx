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
  ReferenceArea,
  Label,
  CartesianGrid,
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
  const [leftReferenceArea, setLeftReferenceArea] = React.useState<string>();
  const [rightReferenceArea, setRightReferenceArea] = React.useState<string>();
  const summarizedData = {} as any;
  console.log("data", data);

  data.forEach((item) => {
    const date = new Date(item.date).toLocaleDateString();
    if (summarizedData[date]) {
      summarizedData[date].value += item.value;
    } else {
      summarizedData[date] = { ...item };
      summarizedData[date].date = date;
      summarizedData[date].originalDate = item.date;
    }
  });

  const dataNormalized = Object.values(summarizedData);

  // const dataNormalized = data.map((item) => ({
  //   ...item,
  //   date: new Date(item.date).toLocaleDateString(),
  //   originalDate: item.date,
  // }));

  const zoom = () => {
    // if (leftReferenceArea === rightReferenceArea || rightReferenceArea === "") {
    //   setLeftReferenceArea("");
    //   setRightReferenceArea("");
    //   return;
    // }
    setLeftReferenceArea("");
    setRightReferenceArea("");

    // if (
    //   leftReferenceArea &&
    //   rightReferenceArea &&
    //   leftReferenceArea > rightReferenceArea
    // ) {
    //   setLeftReferenceArea("");
    //   setRightReferenceArea("");
    //   return;
    // }
  };

  const handleMouseDown = (e: any, s: any) => {
    const originalDate = e.activePayload[0].payload.originalDate;
    setLeftReferenceArea(e.activeLabel);
    setStartDate(new Date(originalDate));
  };

  const handleMouseMove = (e: any, s: any) => {
    if (leftReferenceArea) {
      setRightReferenceArea(e.activeLabel);
    }
  };

  const handleMouseUp = (e: any, s: any) => {
    const originalDate = e.activePayload[0].payload.originalDate;
    const endDate = new Date(originalDate);

    zoom();

    if (startDate) {
      if (startDate.getTime() > endDate.getTime()) {
        onRangeChange?.({ start: endDate, end: startDate });
      } else {
        onRangeChange?.({ start: startDate, end: endDate });
      }
    }
  };

  console.log(data, dataNormalized);

  return (
    <div style={{ userSelect: "none", height: 500 }}>
      {/* {JSON.stringify({ leftReferenceArea, rightReferenceArea })} */}
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
          onMouseMove={handleMouseMove}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis allowDataOverflow dataKey="date" />
          <YAxis type="number" yAxisId="1" />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" name="transaction amount" yAxisId="1">
            {dataNormalized.map((entry: any, index: number) => {
              const color = entry.value > 0 ? "#48bb78" : "#f56565";
              return <Cell key={`cell-${index}`} fill={color} />;
            })}

            {/* {Object.keys(summarizedData).map((key, index) => {
              const color =
                summarizedData[key]._sum.value > 0 ? "#48bb78" : "#f56565";
              return <Cell key={`cell-${index}`} fill={color} />;
            })} */}
          </Bar>

          {leftReferenceArea && rightReferenceArea && (
            <ReferenceArea
              x1={leftReferenceArea}
              x2={rightReferenceArea}
              yAxisId="1"
              // x2="06/12/2022"
              // x1="21/12/2022"
              strokeOpacity={0.3}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
