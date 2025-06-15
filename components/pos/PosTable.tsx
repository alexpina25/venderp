"use client";

import { columns } from "./posColumns";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { PosWithCenter } from "@/types";

interface PosTableProps {
    data: PosWithCenter[];
}

export function PosTable({ data }: PosTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumn="name"
      searchPlaceholder="Buscar ubicación..."
    />
  );
}
