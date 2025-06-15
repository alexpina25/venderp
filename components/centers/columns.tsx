"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Center } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { EditCenterModal } from "./forms/EditCenterModal";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export type CenterChild = Center & {
  parentCenter: Pick<Center, "name"> | null;
  pos: { id: string }[];
};

export const columns: ColumnDef<CenterChild>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      const center = row.original;
      return (
        <div className="flex items-center gap-2 justify-between">
          <span className="font-medium">{row.getValue("name")}</span>
          <Link href={`/centers/${center.id}`}>
            <Button variant="ghost" size="icon">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "parentCenter.name",
    header: "Centro padre",
    cell: ({ row }) => row.original.parentCenter?.name ?? "-",
  },
  {
    accessorKey: "active",
    header: "Estado",
    cell: ({ row }) => {
      const isActive = row.getValue("active") as boolean;
      return (
        <Badge variant={isActive ? "default" : "destructive"}>
          {isActive ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Creado el",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as string);
      return date.toLocaleDateString("es-ES");
    },
  },
  {
    id: "pdvCount",
    header: "PDVs activos",
    cell: ({ row }) => row.original.pos.length,
  },
/*   {
    id: "acciones",
    header: "",
    cell: ({ row }) => {
      const center = row.original as Center;
      return <EditCenterModal center={center} />;
    },
  }, */
];
