"use client";

import { DataTable } from "@/components/ui/data-table/DataTable";
import { RouteWithStops } from "@/types";
import { columns } from "./columns";

interface Props {
  data: RouteWithStops[];
}

export function RouteTable({ data }: Props) {
  return <DataTable columns={columns} data={data} />;
}
