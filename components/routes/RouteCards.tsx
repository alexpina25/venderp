"use client";

import { RouteWithStops } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function getRouteStatus(route: RouteWithStops) {
  const completedStops = route.stops.filter(
    (s) =>
      s.cashCollected !== null ||
      s.walletReload !== null ||
      s.notes !== null ||
      s.maintenanceNotes !== null ||
      s.priceChangeNotes !== null
  ).length;

  const routeDate = new Date(route.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (completedStops >= route.stops.length && route.stops.length > 0) {
    return { label: "Completada", variant: "default" as const };
  }

  if (routeDate > today)
    return { label: "Pendiente", variant: "secondary" as const };
  if (routeDate.getTime() === today.getTime())
    return { label: "En curso", variant: "outline" as const };

  return { label: "Incompleta", variant: "destructive" as const };
}

interface Props {
  data: RouteWithStops[];
}

export function RouteCards({ data }: Props) {
  const sorted = [...data].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sorted.map((route, idx) => {
        const completedStops = route.stops.filter(
          (s) =>
            s.cashCollected !== null ||
            s.walletReload !== null ||
            s.notes !== null ||
            s.maintenanceNotes !== null ||
            s.priceChangeNotes !== null
        ).length;
        const { label, variant } = getRouteStatus(route);

        return (
          <Card key={route.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Ruta {idx + 1} -{" "}
                {format(new Date(route.date), "PPP", { locale: es })}
              </CardTitle>
              <Badge variant={variant} className="text-xs w-fit">
                {label}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <p>
                <strong>Operario:</strong>{" "}
                {route.operator?.name ?? "Sin asignar"}
              </p>
              <p>
                <strong>Paradas:</strong> {route.stops.length}
              </p>
              <p>
                <strong>Completadas:</strong> {completedStops}
              </p>

              <div className="flex gap-2 mt-3">
                <Link href={`/routes/${route.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
