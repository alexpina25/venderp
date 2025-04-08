"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Location } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { EditLocationModal } from "./forms/EditLocationModal";
import { LocationWithClient } from "@/types";

export const columns: ColumnDef<LocationWithClient>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
    ),
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
      const location = row.original;
      return <EditLocationModal location={location} />;
    },
  },
];
