"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <Card key={p.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{p.product.name}</CardTitle>
              <CardAction>
                <Button
                  size="sm"
                  onClick={() => openAdjustStockModal(p.id, p.product.name)}
                >
                  Ajustar Stock
                </Button>
              </CardAction>
              <CardDescription>
                Línea {p.line} · Selección {p.selection}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p>
                <strong>Stock:</strong> {p.currentStock}
              </p>
              <p>
                <strong>Precio:</strong> {p.product.price.toFixed(2)}€
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
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
