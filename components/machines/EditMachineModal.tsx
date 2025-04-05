"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { EditMachineForm } from "./EditMachineForm";
import { Machine } from "@prisma/client";

interface Props {
  machine: Machine & { location: { name: string } };
  open: boolean;
  onClose: () => void;
}

export function EditMachineModal({ machine, open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Editar máquina</DialogTitle>
        </DialogHeader>

        {/* Formulario de edición */}
        <EditMachineForm machine={machine} onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
}
