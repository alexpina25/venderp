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
import { NewPosForm } from "./NewPosForm";
import { useState } from "react";

export function NewPosModal() {
    const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          <Button variant="default" size="sm" className="gap-1">
            <Plus className="w-4 h-4" />
            Nuevo PDV
          </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Registrar nuevo PDV</DialogTitle>
        </DialogHeader>

          <NewPosForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
