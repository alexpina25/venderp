"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { User } from "@prisma/client";

export type UserRow = Pick<User, "id" | "email" | "name" | "role">;

export const columns: ColumnDef<UserRow>[] = [
  {
    accessorKey: "email",
    header: "Usuario",
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return <Badge variant="outline">{role}</Badge>;
    },
  },
];
