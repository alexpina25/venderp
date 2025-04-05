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
}

export function EditProductModal({ product }: Props) {
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
          <DialogTitle>Editar producto</DialogTitle>
        </DialogHeader>

        <EditProductForm product={product} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
