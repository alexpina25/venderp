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
import { NewMachineForm } from "./NewMachineForm";
import { useState } from "react";

export function NewMachineModal() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-1">
          <Plus className="w-4 h-4" />
          Nueva máquina
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Registrar nueva máquina</DialogTitle>
        </DialogHeader>

        <NewMachineForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
