"use client";

import { Center } from "@prisma/client";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table/DataTable";

interface CenterTableProps {
  data: Center[];
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
