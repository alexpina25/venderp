"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NewLocationForm } from "./NewLocationForm";

export function NewLocationModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-1">
          <Plus className="w-4 h-4" />
          Nueva ubicación
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Registrar nueva ubicación</DialogTitle>
        </DialogHeader>

        <NewLocationForm />
      </DialogContent>
    </Dialog>
  );
}
