"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Client } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { EditClientModal } from "./EditClientModal";

export const columns: ColumnDef<Client>[] = [
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
          {isActive ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
  {
    id: "acciones",
    header: "",
    cell: ({ row }) => {
      const client = row.original;
      return <EditClientModal client={client} />;
    },
  },
];
