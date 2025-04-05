"use client";

import { Client } from "@prisma/client";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table/DataTable";

interface ClientTableProps {
  data: Client[];
}

export function ClientTable({ data }: ClientTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumn="name"
      searchPlaceholder="Buscar cliente..."
    />
  );
}
