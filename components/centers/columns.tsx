"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Center } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { EditCenterModal } from "./forms/EditCenterModal";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Center>[] = [
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
    accessorKey: "city",
    header: "Ciudad",
  },
  {
    accessorKey: "contactName",
    header: "Contacto",
  },
  {
    accessorKey: "contactEmail",
    header: "Email",
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
          {isActive ? "Activo" : "Inactivo"}
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
      const center = row.original;
      return <EditCenterModal center={center} />;
    },
  },
];
