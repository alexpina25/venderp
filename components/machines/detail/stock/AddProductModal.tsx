"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product, Machine } from "@prisma/client";
import { toast } from "@/components/ui/use-toast";
import { addMachineProduct } from "@/app/actions/addMachineProduct";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ✅ Nueva Interface recibiendo máquina completa
interface AddProductModalProps {
  machine: Machine;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialLine?: string;
  initialSelection?: string;
}

export function AddProductModal({
  machine,
  open,
  onClose,
  onSuccess,
  initialLine,
  initialSelection,
}: AddProductModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [line, setLine] = useState(initialLine || "");
  const [selection, setSelection] = useState(initialSelection || "");

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/products?active=true");
      const data = await response.json();
      setProducts(data);
    };

    if (open) {
      fetchProducts();
      setLine(initialLine || "");
      setSelection(initialSelection || "");
    }
  }, [open, initialLine, initialSelection]);

  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product || null);
    setPrice(product?.price || 0);
  };

  const handleAddProduct = async () => {
    if (!selectedProduct || quantity <= 0 || !line || !selection) return;

    try {
      await addMachineProduct({
        machineId: machine.id,
        productId: selectedProduct.id,
        quantity,
        price,
        line,
        selection,
      });
      onSuccess();
      onClose();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo añadir el producto",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Añadir producto a la máquina {machine.customId ?? machine.id}
          </DialogTitle>
        </DialogHeader>

        {/* Selección de producto */}
        <Select onValueChange={handleProductSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un producto" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Línea */}
        <Input
          className="mt-4"
          value={line}
          onChange={(e) => setLine(e.target.value)}
          placeholder="Número de línea (Ej: 1, 2, 3)"
        />

        {/* Selección */}
        <Input
          className="mt-4"
          value={selection}
          onChange={(e) => setSelection(e.target.value)}
          placeholder="Número de selección (Ej: A1, B1, etc.)"
        />

        {/* Precio del producto seleccionado */}
        {selectedProduct && (
          <div className="mt-4 text-sm text-muted-foreground">
            Precio actual: {price.toFixed(2)}€
          </div>
        )}

        {/* Cantidad */}
        <Input
          className="mt-4"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder="Cantidad a añadir"
        />

        {/* Footer con botones */}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="default"
            onClick={handleAddProduct}
            disabled={!selectedProduct || quantity <= 0 || !line || !selection}
          >
            Añadir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
