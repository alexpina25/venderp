"use client";

import { useState } from "react";
import { Product } from "@prisma/client";
import { EditProductForm } from "./EditProductForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface Props {
  product: Product;
    open?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export function EditProductModal({ product, open, onClose, onSuccess }: Props) {
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
          <DialogTitle>Editar producto</DialogTitle>
        </DialogHeader>

        <EditProductForm product={product} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
