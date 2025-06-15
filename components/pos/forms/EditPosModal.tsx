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
  open?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export function EditPosModal({
  pos,
  open,
  onClose,
  onSuccess,
}: EditPosModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined && onClose !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;

  const handleClose = () => {
    if (isControlled) {
      onClose?.();
    } else {
      setInternalOpen(false);
    }
  };

  const handleSuccess = () => {
    onSuccess?.();
    handleClose();
  };

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={isControlled ? onClose : setInternalOpen}
    >
      {!isControlled && (
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Pencil className="w-4 h-4" />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Editar ubicación</DialogTitle>
        </DialogHeader>

          <EditPosForm pos={pos} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
