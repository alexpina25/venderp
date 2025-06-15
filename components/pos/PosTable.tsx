"use client";

import { columns } from "./posColumns";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { PosWithLastSale } from "@/types";

interface PosTableProps {
  data: PosWithLastSale[];
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
