"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Machine } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditMachineModal } from "./forms/EditMachineModal";

export const columns: ColumnDef<Machine & { pos: { name: string } | null }>[] =
  [
    {
      accessorKey: "customId",
      header: "Máquina",
      cell: ({ row }) => {
        const machine = row.original;
        const customId = row.getValue("customId") as number | null;
        const id = customId ?? machine.id;
        return (
          <div className="flex items-center gap-2 justify-between">
            <span className="font-medium">{id}</span>
            <Link href={`/machines/${machine.id}`}>
              <Button variant="ghost" size="icon">
                <Eye className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        );
      },
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
            : status === "RETIRED"
            ? "secondary"
            : "outline";
        const label =
          status === "ACTIVE"
            ? "Activa"
            : status === "OUT_OF_SERVICE"
            ? "Fuera de servicio"
            : status === "RETIRED"
            ? "Retirada"
            : "Sin instalar";
        return <Badge variant={variant}>{label}</Badge>;
      },
    },
    {
      accessorKey: "pos.name",
      header: "PDV",
      cell: ({ row }) =>
        row.original.pos?.name ?? (
          <span className="text-muted-foreground italic">Sin asignar</span>
        ),
    },
  ];
