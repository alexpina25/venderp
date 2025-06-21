"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, GripVertical } from "lucide-react";
import Link from "next/link";
import { RouteWithStops } from "@/types";
import { RouteInfo } from "@/components/routes/detail/RouteInfo";
import { EditRouteModal } from "@/components/routes/forms/EditRouteModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

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
  const [stopOrder, setStopOrder] = useState<string[]>([]);

  useEffect(() => {
    fetchRoute(params.id).then((data) => {
      setRoute(data);
      setStopOrder(data.stops.map((s) => s.id));
    });
  }, [params.id]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = stopOrder.indexOf(active.id);
    const newIndex = stopOrder.indexOf(over.id);
    const newOrder = [...stopOrder];
    newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, active.id);
    setStopOrder(newOrder);
    // TODO: sync order with backend
  };

  const stopsSorted = route?.stops.sort(
    (a, b) => stopOrder.indexOf(a.id) - stopOrder.indexOf(b.id)
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild size="icon">
          <Link href="/routes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">Detalle de Ruta</h2>
        {route && <EditRouteModal route={route} />}
      </div>

      {route && (
        <>
          <RouteInfo route={route} />

          <DndContext
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={stopOrder}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-4 mt-4">
                {stopsSorted?.map((stop, idx) => (
                  <StopCard key={stop.id} stop={stop} index={idx + 1} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </>
      )}
    </div>
  );
}

function StopCard({
  stop,
  index,
}: {
  stop: RouteWithStops["stops"][0];
  index: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: stop.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const isCompleted =
    stop.cashCollected !== null ||
    stop.walletReload !== null ||
    stop.notes !== null ||
    stop.maintenanceNotes !== null ||
    stop.priceChangeNotes !== null;

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="p-4 border rounded-md bg-card shadow-sm flex items-center justify-between"
    >
      <div className="flex gap-3 items-center w-full">
        <div {...listeners} className="cursor-move text-muted-foreground">
          <GripVertical size={16} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex justify-between">
            <p className="font-semibold">
              {index}. {stop.pos.name}
            </p>
            <Badge variant={isCompleted ? "default" : "destructive"}>
              {isCompleted ? "Completado" : "Pendiente"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            POS: {stop.pos.code} — Ciudad: {stop.pos.city}
          </p>
        </div>
        <div className="flex gap-2 ml-auto">
          <Link href={`/pos/${stop.pos.id}`}>
            <Button size="sm" variant="outline">
              Ver POS
            </Button>
          </Link>
          <Button size="sm" variant="secondary">
            Completar
          </Button>
        </div>
      </div>
    </li>
  );
}
