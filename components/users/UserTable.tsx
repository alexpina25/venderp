"use client";

import { DataTable } from "@/components/ui/data-table/DataTable";
import { columns, UserRow } from "./columns";

interface UserTableProps {
  data: UserRow[];
}

export function UserTable({ data }: UserTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumn="email"
      searchPlaceholder="Buscar usuario..."
    />
  );
}
