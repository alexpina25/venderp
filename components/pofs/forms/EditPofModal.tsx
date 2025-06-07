"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditPofForm } from "./EditPofForm";
import { POF, Center } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";

// Extendemos si necesitas más relaciones (por ejemplo, client)
interface EditPofModalProps {
  pof: POF & {
    center: Center;
  };
}

export function EditPofModal({ pof }: EditPofModalProps) {
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

        <EditPofForm pof={pof} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
