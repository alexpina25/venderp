"use client";

import { useState } from "react";
import { RouteWithStops } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { EditRouteForm } from "./EditRouteForm";

interface Props {
  route: RouteWithStops;
}

export function EditRouteModal({ route }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Editar ruta</DialogTitle>
        </DialogHeader>

        <EditRouteForm route={route} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}