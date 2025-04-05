"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Machine } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { EditMachineModal } from "./EditMachineModal";

export const columns: ColumnDef<Machine & { location: { name: string } }>[] = [
  {
    accessorKey: "code",
    header: "Código",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("code")}</span>
    ),
  },
  {
    accessorKey: "model",
    header: "Modelo",
    cell: ({ row }) =>
      row.getValue("model") || (
        <span className="text-muted-foreground italic">–</span>
      ),
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const value = row.getValue("type");
      const label =
        value === "SNACK"
          ? "Snack"
          : value === "DRINK"
          ? "Bebida"
          : value === "COMBO"
          ? "Combo"
          : "Otro";
      return <Badge variant="outline">{label}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status");
      const variant =
        status === "ACTIVE"
          ? "default"
          : status === "OUT_OF_SERVICE"
          ? "destructive"
          : "secondary";
      const label =
        status === "ACTIVE"
          ? "Activa"
          : status === "OUT_OF_SERVICE"
          ? "Fuera de servicio"
          : "Retirada";
      return <Badge variant={variant}>{label}</Badge>;
    },
  },
  {
    accessorKey: "location.name",
    header: "Cliente",
    cell: ({ row }) =>
      row.original.location?.name ?? (
        <span className="text-muted-foreground italic">Sin asignar</span>
      ),
  },
  {
    id: "acciones",
    header: "",
    cell: ({ row }) => {
      const machine = row.original;
      return <EditMachineModal machine={machine} />;
    },
  },
];
