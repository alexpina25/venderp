"use client";

import { ColumnDef } from "@tanstack/react-table";
import { POS } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditPosModal } from "./forms/EditPosModal";
import { PosWithCenter } from "@/types";

export const columns: ColumnDef<PosWithCenter>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
        const pos = row.original;
      return (
        <div className="flex items-center gap-2 justify-between">
          <span className="font-medium">{row.getValue("name")}</span>
          <Link href={`/pos/${pos.id}`}>
            <Button variant="ghost" size="icon">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "city",
    header: "Ciudad",
  },
  {
    accessorKey: "address",
    header: "Dirección",
  },
  {
    accessorKey: "contactName",
    header: "Contacto",
  },
  {
    accessorKey: "contactPhone",
    header: "Teléfono",
  },
  {
    accessorKey: "active",
    header: "Estado",
    cell: ({ row }) => {
      const isActive = row.getValue("active");
      return (
        <Badge variant={isActive ? "default" : "destructive"}>
          {isActive ? "Activa" : "Inactiva"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Creado el",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString("es-ES");
    },
  },
  {
    id: "acciones",
    header: "",
    cell: ({ row }) => {
        const pos = row.original;
        return <EditPosModal pos={pos} />;
    },
  },
];
