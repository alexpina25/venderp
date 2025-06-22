"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AdjustStockModal } from "@/components/machines/detail/stock/AdjustStockModal";

interface Props {
  posId: string;
}

type MachineProduct = {
  id: string;
  line: string;
  selection: string;
  currentStock: number;
  maxCapacity: number;
  minThreshold: number;
  product: {
    name: string;
    price: number;
  };
};

export function StopProductsList({ posId }: Props) {
  const [products, setProducts] = useState<MachineProduct[] | null>(null);
  const [machineId, setMachineId] = useState<string | null>(null);
  const [adjustStockModalOpen, setAdjustStockModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [selectedProductName, setSelectedProductName] = useState<string>("");

  useEffect(() => {
    fetch(`/api/pos/${posId}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.machine?.products ?? []);
        setMachineId(data.machine?.id ?? null);
      })
      .catch(console.error);
  }, [posId]);

  const refreshProducts = async () => {
    const res = await fetch(`/api/pos/${posId}`);
    const data = await res.json();
    setProducts(data.machine?.products ?? []);
  };

  const openAdjustStockModal = (productId: string, productName: string) => {
    setSelectedProductId(productId);
    setSelectedProductName(productName);
    setAdjustStockModalOpen(true);
  };

  if (!products) {
    return (
      <p className="text-sm text-muted-foreground">Cargando productos...</p>
    );
  }

  if (products.length === 0) {
    return <p className="text-sm text-muted-foreground">Sin productos</p>;
  }

  return (
    <>
    <Table className="bg-background rounded-md border">
      <TableHeader>
        <TableRow>
          <TableHead>Línea</TableHead>
          <TableHead>Selección</TableHead>
          <TableHead>Producto</TableHead>
          <TableHead>Ajustar Stock</TableHead>
          <TableHead className="text-center">Stock</TableHead>
          <TableHead className="text-right">Precio (€)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((p) => (
          <TableRow key={p.id}>
            <TableCell>{p.line}</TableCell>
            <TableCell>{p.selection}</TableCell>
            <TableCell>{p.product.name}</TableCell>
            <TableCell>
              <Button size="sm" onClick={() => openAdjustStockModal(p.id, p.product.name)}>
                Ajustar Stock
              </Button>
            </TableCell>
            <TableCell className="text-center">{p.currentStock}</TableCell>
            <TableCell className="text-right">
              {p.product.price.toFixed(2)}€
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    {adjustStockModalOpen && selectedProductId && machineId && (
      <AdjustStockModal
        open={adjustStockModalOpen}
        onClose={() => setAdjustStockModalOpen(false)}
        onSuccess={refreshProducts}
        machineId={machineId}
        machineProductId={selectedProductId}
        productName={selectedProductName}
      />
    )}
    </>
  );
}