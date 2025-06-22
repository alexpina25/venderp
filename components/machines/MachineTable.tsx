"use client";

import { Machine } from "@prisma/client";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table/DataTable";

interface MachineTableProps {
  data: (Machine & { pos: { name: string } | null })[];
}

export function MachineTable({ data }: MachineTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumn="customId"
      searchPlaceholder="Buscar por ID..."
    />
  );
}
