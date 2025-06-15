"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Master } from "@prisma/client";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Master & { pos: { name: string } | null }>[] = [
  {
    accessorKey: "serialNumber",
    header: "Serie",
    cell: ({ row }) => {
      const master = row.original;
      return (
        <div className="flex items-center gap-2 justify-between">
          <span className="font-medium">{master.serialNumber}</span>
          <Link href={`/masters/${master.id}`}>
            <Button variant="ghost" size="icon">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "pos",
    header: "POS",
    cell: ({ row }) => row.original.pos?.name || "-",
  },
  {
    accessorKey: "createdAt",
    header: "Creado el",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString("es-ES");
    },
  },
];
