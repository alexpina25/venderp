"use client"

import { useEffect, useState } from "react";
import { CustomIcon } from "@/components/ui/CustomIcon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart } from "lucide-react";
import { SalesChart, SalesData } from "../SalesChart";

const options = [
  { value: "day", label: "D\u00eda" },
  { value: "week", label: "Semana" },
  { value: "month", label: "Mes" },
  { value: "year", label: "A\u00f1o" },
] as const;

type Group = typeof options[number]["value"];

export function RefillStats() {
  const [group, setGroup] = useState<Group>("month");
  const [data, setData] = useState<SalesData[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/metrics/sales?group=${group}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [group]);

  return (
    <div className="shadow-sm bg-background rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-x-2 items-center">
          <CustomIcon icon={BarChart} />
          <p className="text-xl">Sales Distribution</p>
        </div>
        <Select value={group} onValueChange={(v) => setGroup(v as Group)}>
          <SelectTrigger className="w-24 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value} className="text-xs">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <SalesChart data={data} />
    </div>
  );
}