"use client";

import { RouteWithStops } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EditRouteModal } from "./forms/EditRouteModal";

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

interface Props {
  data: RouteWithStops[];
}

export function RouteAccordion({ data }: Props) {
  const grouped: Record<string, RouteWithStops[]> = {};
  for (const route of data) {
    const key = new Date(route.date).toISOString().split("T")[0];
    grouped[key] = grouped[key] ? [...grouped[key], route] : [route];
  }

  const days = Object.keys(grouped).sort((a, b) => (a > b ? -1 : 1));

  return (
    <Accordion type="multiple" className="w-full">
      {days.map((day) => (
        <AccordionItem key={day} value={day} className="border-b">
          <AccordionTrigger>
            {format(new Date(day), "PPP", { locale: es })}
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-4">
              {grouped[day].map((route) => {
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
                  <li
                    key={route.id}
                    className="border rounded-md p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">
                        {route.operator?.name ?? "Sin asignar"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Paradas: {route.stops.length} · Completadas:{" "}
                        {completedStops}
                      </p>
                                            {route.stops.length > 0 && (
                        <p className="text-sm">
                          {route.stops.map((s) => s.pos.name).join(", ")}
                        </p>
                      )}
                      {route.notes && (
                        <p className="text-sm text-muted-foreground">
                          {route.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={variant}>{label}</Badge>
                      <Link href={`/routes/${route.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <EditRouteModal route={route} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
