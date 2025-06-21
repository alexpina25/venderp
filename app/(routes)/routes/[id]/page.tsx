"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RouteWithStops, StopWithPOS } from "@/types";
import { RouteInfo } from "@/components/routes/detail/RouteInfo";
import { EditRouteModal } from "@/components/routes/forms/EditRouteModal";
import { StopItem } from "@/components/routes/detail/StopItem";

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
  const [stops, setStops] = useState<StopWithPOS[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchRoute(params.id)
      .then((data) => {
        setRoute(data);
        setStops(data.stops);
      })
      .catch(console.error);
  }, [params.id]);

  const moveToStart = (index: number) => {
    setStops((prev) => {
      const newStops = [...prev];
      const [item] = newStops.splice(index, 1);
      newStops.unshift(item);
      return newStops;
    });
  };

  const moveToEnd = (index: number) => {
    setStops((prev) => {
      const newStops = [...prev];
      const [item] = newStops.splice(index, 1);
      newStops.push(item);
      return newStops;
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button asChild size="icon" variant="outline">
            <Link href="/routes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold">Detalle de Ruta</h2>
        </div>
        {route && <EditRouteModal route={route} />}
      </div>

      {route && (
        <>
          <RouteInfo route={route} />

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Paradas</h3>
            <div className="flex flex-col gap-4">
              {stops.map((stop, index) => (
                <StopItem
                  key={stop.id}
                  stop={stop}
                  index={index}
                  onMoveToStart={() => moveToStart(index)}
                  onMoveToEnd={() => moveToEnd(index)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
