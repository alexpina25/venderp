"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditCenterForm } from "./EditCenterForm";
import { Center } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";

interface EditCenterModalProps {
  center: Center;
  open?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export function EditCenterModal({
  center,
  open,
  onClose,
  onSuccess,
}: EditCenterModalProps) {
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
          <DialogTitle>Editar cliente</DialogTitle>
        </DialogHeader>
        <EditCenterForm center={center} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
