"use client";

import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend } from "recharts";

export type TotalMachinesData = {
  name: string;
  value: number;
  fill: string;
};
interface TotalMachinesChartProps {
  data: TotalMachinesData[];
}

export function TotalMachinesChart({ data }: TotalMachinesChartProps) {
  return (
    <div className="w-full h-[200px] p-5">
      <ResponsiveContainer aspect={1} maxHeight={200}>
        <PieChart>
          <Pie dataKey="value" data={data} outerRadius={80} labelLine={false} />
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
