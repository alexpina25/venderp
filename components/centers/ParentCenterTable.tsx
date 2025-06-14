"use client";

import { DataTable } from "@/components/ui/data-table/DataTable";
import { parentColumns, ParentCenter } from "./parentColumns";

interface ParentCenterTableProps {
  data: ParentCenter[];
}

export function ParentCenterTable({ data }: ParentCenterTableProps) {
  return (
    <DataTable
      columns={parentColumns}
      data={data}
      filterColumn="name"
      searchPlaceholder="Buscar centro..."
    />
  );
}
