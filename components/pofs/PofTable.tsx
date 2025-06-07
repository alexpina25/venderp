"use client";

import { POF } from "@prisma/client";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { PofWithCenter } from "@/types";

interface PofTableProps {
    data: PofWithCenter[];
  }

export function PofTable({ data }: PofTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumn="name"
      searchPlaceholder="Buscar ubicación..."
    />
  );
}
