"use client";

import { Product } from "@prisma/client";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table/DataTable";

interface ProductTableProps {
  data: Product[];
}

export function ProductTable({ data }: ProductTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumn="name"
      searchPlaceholder="Buscar producto..."
    />
  );
}
