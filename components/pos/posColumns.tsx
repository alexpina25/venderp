"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoverageIndicator } from "./CoverageIndicator";
import { PosWithLastSale } from "@/types";

export const columns: ColumnDef<PosWithLastSale>[] = [
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
    accessorKey: "code",
    header: "Código",
  },
  {
    accessorKey: "centerId",
    header: "Center ID",
  },
  {
    id: "centerName",
    header: "Centro",
    cell: ({ row }) => row.original.center.name,
  },
  {
    id: "machineId",
    header: "Máquina",
    cell: ({ row }) => row.original.machine ? row.original.machine.id : "-",
  },
  {
    id: "masterSerial",
    header: "Master",
    cell: ({ row }) =>
      row.original.master ? row.original.master.serialNumber : "-",
  },
  {
    accessorKey: "coverage",
    header: "Cobertura",
    cell: ({ row }) => {
      const coverage = row.getValue("coverage") as number;
      return (
        <div className="flex items-center gap-2">
          <CoverageIndicator value={coverage} />
          <span className="text-sm text-muted-foreground">{coverage}</span>
        </div>
      );
    },
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
    accessorKey: "lastSale",
    header: "Última venta",
    cell: ({ row }) => {
      const lastSale = row.original.lastSale;
      if (!lastSale) return <span className="italic text-muted-foreground">–</span>;
      const date = new Date(lastSale.timestamp);
      const diff = Date.now() - date.getTime();
      const hour = 60 * 60 * 1000;
      const day = 24 * hour;
      const color = diff <= hour ? "bg-green-500" : diff <= day ? "bg-yellow-500" : "bg-red-500";
      return (
        <div className="flex items-center gap-2">
          {date.toLocaleString("es-ES")}
          <span className={`w-2 h-2 rounded-full ${color}`}></span>
        </div>
      );
    },
  },
/*   {
    accessorKey: "createdAt",
    header: "Creado el",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString("es-ES");
    },
  }, */
/*   {
    id: "acciones",
    header: "",
    cell: ({ row }) => {
        const pos = row.original;
        return <EditPosModal pos={pos} />;
    },
  }, */
];
