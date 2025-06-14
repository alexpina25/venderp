"use client";

import { columns, CenterChild } from "./columns";
import { DataTable } from "@/components/ui/data-table/DataTable";

interface CenterTableProps {
  data: CenterChild[];
}

export function CenterTable({ data }: CenterTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumn="name"
      searchPlaceholder="Buscar cliente..."
    />
  );
}
