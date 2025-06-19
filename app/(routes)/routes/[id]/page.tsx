"use client";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RouteWithStops } from "@/types";
import { RouteInfo } from "@/components/routes/detail/RouteInfo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

async function fetchRoute(id: string): Promise<RouteWithStops> {
  const res = await fetch(`/api/routes/${id}`);
  if (!res.ok) throw new Error("Error fetching route");
  return res.json();
}

export default function RouteDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [route, setRoute] = useState<RouteWithStops | null>(null);

  useEffect(() => {
    fetchRoute(params.id).then(setRoute).catch(console.error);
  }, [params.id]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild size="icon">
          <Link href="/routes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">Detalle de Ruta</h2>
      </div>

      {route && (
        <div className="space-y-4">
          <RouteInfo route={route} />
          {route.stops.length > 0 && (
            <Accordion
              type="single"
              collapsible
              className="border rounded-md divide-y"
            >
              {route.stops.map((stop, idx) => {
                const completed =
                  stop.cashCollected !== null ||
                  stop.walletReload !== null ||
                  stop.notes !== null ||
                  stop.maintenanceNotes !== null ||
                  stop.priceChangeNotes !== null;

                return (
                  <AccordionItem key={stop.id} value={stop.id}>
                    <AccordionTrigger className="px-4">
                      <div className="flex justify-between w-full">
                        <span>
                          {idx + 1}. {stop.pos.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {completed ? "Completado" : "Pendiente"}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 space-y-2">
                      <p className="text-sm">
                        Estado: {completed ? "Completado" : "Pendiente"}
                      </p>
                      <p className="text-sm">Hora visita: –</p>
                      {stop.notes && (
                        <p className="text-sm text-muted-foreground">
                          {stop.notes}
                        </p>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Link href={`/pos/${stop.pos.id}`}>
                          <Button variant="outline" size="sm">
                            Ver POS
                          </Button>
                        </Link>
                        <Button size="sm" variant="secondary">
                          Reponer
                        </Button>
                        <Button size="sm">Marcar completado</Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>
      )}
    </div>
  );
}
