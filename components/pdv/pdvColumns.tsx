"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PDV } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditPdvModal } from "./forms/EditPdvModal";
import { PdvWithCenter } from "@/types";

export const columns: ColumnDef<PdvWithCenter>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
        const pdv = row.original;
      return (
        <div className="flex items-center gap-2 justify-between">
          <span className="font-medium">{row.getValue("name")}</span>
          <Link href={`/pdvs/${pdv.id}`}>
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
        const pdv = row.original;
        return <EditPdvModal pdv={pdv} />;
    },
  },
];
