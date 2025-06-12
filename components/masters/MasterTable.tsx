"use client";
import { Master } from "@prisma/client";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table/DataTable";

interface Props {
  data: (Master & { pos: { name: string } | null })[];
}

export function MasterTable({ data }: Props) {
  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumn="serialNumber"
      searchPlaceholder="Buscar número de serie..."
    />
  );
}
