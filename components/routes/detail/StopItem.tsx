"use client";

import { ChevronsUp, ChevronsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StopWithPOS } from "@/types";
import { ManageStopLink } from "./ManageStopLink";

interface Props {
  stop: StopWithPOS;
  index: number;
  onMoveToStart: () => void;
  onMoveToEnd: () => void;
}

export function StopItem({ stop, index, onMoveToStart, onMoveToEnd }: Props) {
  const completed =
    stop.cashCollected !== null ||
    stop.walletReload !== null ||
    stop.notes !== null ||
    stop.maintenanceNotes !== null ||
    stop.priceChangeNotes !== null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-background border rounded-md shadow-sm">
      <div className="flex items-center gap-3 w-full sm:w-auto">
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
        <Button variant="ghost" size="icon" onClick={onMoveToStart}>
          <ChevronsUp className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onMoveToEnd}>
          <ChevronsDown className="w-4 h-4" />
        </Button>
        <ManageStopLink stop={stop} />
      </div>
    </div>
  );
}
