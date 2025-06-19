"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { RouteWithStops } from "@/types";

async function fetchRoute(id: string): Promise<RouteWithStops> {
  const res = await fetch(`/api/routes/${id}`);
  if (!res.ok) throw new Error("Error fetching route");
  return res.json();
}

export default function RouteDetailPage({ params }: { params: { id: string } }) {
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
          <p className="font-semibold">
            {format(new Date(route.date), "PPP", { locale: es })}
          </p>
          <p className="text-sm text-muted-foreground">
            Operador: {route.operatorId}
          </p>
          {route.stops.length > 0 && (
            <ul className="space-y-2">
              {route.stops.map((stop) => (
                <li key={stop.id} className="border p-2 rounded-md">
                  <p className="font-medium">{stop.pos.name}</p>
                  <p className="text-sm">Cobrado: {stop.cashCollected ?? 0}€</p>
                  <p className="text-sm">Recarga: {stop.walletReload ?? 0}€</p>
                  {stop.notes && (
                    <p className="text-sm text-muted-foreground">{stop.notes}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}