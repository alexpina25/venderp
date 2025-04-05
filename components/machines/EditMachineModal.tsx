"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { EditMachineForm } from "./EditMachineForm";
import { Machine } from "@prisma/client";

interface Props {
  machine: Machine & { location: { name: string } };
}

export function EditMachineModal({ machine }: Props) {
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
          <DialogTitle>Editar máquina</DialogTitle>
        </DialogHeader>

        <EditMachineForm machine={machine} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
