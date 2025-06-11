"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditPosForm } from "./EditPosForm";
import { POS, Center } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";

// Extendemos si necesitas más relaciones (por ejemplo, client)
interface EditPosModalProps {
  pos: POS & {
    center: Center;
  };
}

export function EditPosModal({ pos }: EditPosModalProps) {
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
          <DialogTitle>Editar ubicación</DialogTitle>
        </DialogHeader>

        <EditPosForm pos={pos} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
