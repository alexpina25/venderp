"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StopWithPOS } from "@/types"; // Asegúrate de que el tipo incluya `pos`

interface Props {
  stop: StopWithPOS;
  index: number;
  onOpenForm: () => void;
}

export function SortableStopItem({ stop, index, onOpenForm }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: stop.id });

  const completed =
    stop.cashCollected !== null ||
    stop.walletReload !== null ||
    stop.notes !== null ||
    stop.maintenanceNotes !== null ||
    stop.priceChangeNotes !== null;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-background border rounded-md shadow-sm"
    >
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div
          {...attributes}
          {...listeners}
          className="cursor-move text-muted-foreground"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        <div>
          <p className="font-medium">
            {index + 1}. {stop.pos.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {completed ? "Completada" : "Pendiente"}
          </p>
        </div>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenForm}
        >
          {completed ? <CheckCircle className="w-4 h-4 mr-1" /> : <AlertCircle className="w-4 h-4 mr-1" />}
          Gestionar parada
        </Button>
      </div>
    </div>
  );
}
