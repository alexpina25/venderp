"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Eye } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RouteWithStops } from "@/types";

function getRouteStatus(route: RouteWithStops) {
  const completedStops = route.stops.filter(
    (s) =>
      s.cashCollected !== null ||
      s.walletReload !== null ||
      s.notes !== null ||
      s.maintenanceNotes !== null ||
      s.priceChangeNotes !== null
  ).length;

  if (completedStops >= route.stops.length && route.stops.length > 0) {
    return { label: "Completada", variant: "default" as const };
  }

  const routeDate = new Date(route.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (routeDate > today)
    return { label: "Pendiente", variant: "secondary" as const };
  if (routeDate.getTime() === today.getTime())
    return { label: "En curso", variant: "outline" as const };
  return { label: "Incompleta", variant: "destructive" as const };
}

export const columns: ColumnDef<RouteWithStops>[] = [
  {
    accessorKey: "date",
    header: "Fecha",
    cell: ({ row }) => (
      <span className="font-medium">
        {format(new Date(row.original.date), "dd/MM/yyyy", { locale: es })}
      </span>
    ),
  },
  {
    accessorKey: "operator",
    header: "Operario",
    cell: ({ row }) => row.original.operator?.name ?? "Sin asignar",
  },
  {
    id: "stopsCount",
    header: "Paradas",
    cell: ({ row }) => row.original.stops.length,
  },
  {
    id: "completedStops",
    header: "Completadas",
    cell: ({ row }) =>
      row.original.stops.filter(
        (s) =>
          s.cashCollected !== null ||
          s.walletReload !== null ||
          s.notes !== null ||
          s.maintenanceNotes !== null ||
          s.priceChangeNotes !== null
      ).length,
  },
  {
    id: "status",
    header: "Estado",
    cell: ({ row }) => {
      const { label, variant } = getRouteStatus(row.original);
      return <Badge variant={variant}>{label}</Badge>;
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Link href={`/routes/${row.original.id}`}>
        <Button variant="ghost" size="icon">
          <Eye className="w-4 h-4" />
        </Button>
      </Link>
    ),
  },
];
