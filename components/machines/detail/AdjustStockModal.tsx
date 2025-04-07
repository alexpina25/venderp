"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  machineId: string;
  machineProductId: string;
  productName: string;
}

export function AdjustStockModal({
  open,
  onClose,
  onSuccess,
  machineId,
  machineProductId,
  productName,
}: Props) {
  const [quantity, setQuantity] = useState<number>(0);

  const increment = () => setQuantity(quantity + 1);
  const decrement = () => setQuantity(quantity - 1);

  const handleAdjustStock = async () => {
    if (quantity === 0) return;

    const res = await fetch(`/api/machines/${machineId}/adjust-stock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ machineProductId, quantity }),
    });

    if (res.ok) {
      onSuccess();
      onClose();
      setQuantity(0);
    } else {
      const { error } = await res.json();
      alert(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajustar stock para {productName}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="destructive"
              size="icon"
              onClick={decrement}
              disabled={quantity <= -99} // Para evitar decrementos exagerados
            >
              -
            </Button>

            <span className="text-3xl font-semibold">{Math.abs(quantity)}</span>

            <Button
              variant="default"
              size="icon"
              onClick={increment}
              disabled={quantity >= 99} // Evita incrementos exagerados
            >
              +
            </Button>
          </div>

          <div>
            {quantity > 0 && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                Se añadirán {quantity} unidades
              </Badge>
            )}
            {quantity < 0 && (
              <Badge variant="destructive">
                Se retirarán {Math.abs(quantity)} unidades
              </Badge>
            )}
            {quantity === 0 && (
              <Badge variant="outline">Selecciona una cantidad</Badge>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-center gap-2 sm:justify-center">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="default"
            onClick={handleAdjustStock}
            disabled={quantity === 0}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
