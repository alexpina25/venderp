"use client";

import { useState } from "react";
import { StopWithPOS } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StopDetailForm } from "./StopDetailForm";
import { updateRouteStop } from "@/app/actions/updateRouteStop";
import { CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  stop: StopWithPOS;
}

export function ManageStopModal({ stop }: Props) {
  const [open, setOpen] = useState(false);

  const completed =
    stop.cashCollected !== null ||
    stop.walletReload !== null ||
    stop.notes !== null ||
    stop.maintenanceNotes !== null ||
    stop.priceChangeNotes !== null;

  const handleSubmit = async (values: any) => {
    await updateRouteStop({ id: stop.id, ...values });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          {completed ? (
            <CheckCircle className="w-4 h-4 mr-1" />
          ) : (
            <AlertCircle className="w-4 h-4 mr-1" />
          )}
          Gestionar parada
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Gestionar parada</DialogTitle>
        </DialogHeader>
        <StopDetailForm onSubmit={handleSubmit} initialData={stop} />
      </DialogContent>
    </Dialog>
  );
}
