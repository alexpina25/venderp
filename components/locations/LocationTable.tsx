"use client";

import { Location } from "@prisma/client";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { LocationWithClient } from "@/types";

interface LocationTableProps {
    data: LocationWithClient[];
  }

export function LocationTable({ data }: LocationTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumn="name"
      searchPlaceholder="Buscar ubicación..."
    />
  );
}
