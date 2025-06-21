"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RouteWithStops } from "@/types";
import { RouteInfo } from "@/components/routes/detail/RouteInfo";
import { EditRouteModal } from "@/components/routes/forms/EditRouteModal";
import { SortableStopItem } from "@/components/routes/detail/SortableStopItem";

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
  const [items, setItems] = useState<string[]>([]);
  const router = useRouter();

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    fetchRoute(params.id)
      .then((data) => {
        setRoute(data);
        setItems(data.stops.map((s) => s.id));
      })
      .catch(console.error);
  }, [params.id]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.indexOf(active.id);
        const newIndex = prev.indexOf(over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-4">
                  {items.map((id, index) => {
                    const stop = route.stops.find((s) => s.id === id);
                    if (!stop) return null;

                    return (
                      <SortableStopItem
                        key={stop.id}
                        stop={stop}
                        index={index}
                        onOpenForm={() => router.push(`/stops/${stop.id}`)}
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </>
      )}
    </div>
  );
}
