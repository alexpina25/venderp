"use client";

import { columns } from "./pdvColumns";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { PdvWithCenter } from "@/types";

interface PdvTableProps {
    data: PdvWithCenter[];
}

export function PdvTable({ data }: PdvTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumn="name"
      searchPlaceholder="Buscar ubicación..."
    />
  );
}
