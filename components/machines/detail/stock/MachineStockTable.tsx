"use client";

import { useEffect, useState } from "react";
import { MachineWithProducts } from "../MachineDetailsTabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddProductModal } from "@/components/machines/detail/stock/AddProductModal";
import { AdjustStockModal } from "@/components/machines/detail/stock/AdjustStockModal";

interface Props {
  machine: MachineWithProducts;
}

export function MachineStockTable({ machine }: Props) {
  const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
  const [adjustStockModalOpen, setAdjustStockModalOpen] = useState(false);
  const [products, setProducts] = useState(machine.products);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [selectedProductName, setSelectedProductName] = useState<string>("");

  useEffect(() => {
    setProducts(machine.products);
  }, [machine.products]);

  // Refetch para recargar productos actualizados
  const refreshProducts = async () => {
    const response = await fetch(`/api/machines/${machine.id}`);
    const updatedMachine = await response.json();
    setProducts(updatedMachine.products);
  };

  // Abrir modal de añadir producto
  const openAddProductModal = () => {
    setAddProductModalOpen(true);
  };

  // Cerrar modal
  const closeAddProductModal = () => {
    setAddProductModalOpen(false);
  };

  const openAdjustStockModal = (productId: string, productName: string) => {
    setSelectedProductId(productId);
    setSelectedProductName(productName);
    setAdjustStockModalOpen(true);
  };

  const handleRemoveProduct = async (machineProductId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      const res = await fetch(`/api/machines/${machine.id}/remove-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ machineProductId }),
      });

      if (res.ok) {
        refreshProducts(); // Refetch automáticamente
      } else {
        alert("Hubo un error eliminando el producto.");
      }
    }
  };

  return (
    <div className="rounded-md border overflow-x-auto bg-background p-4">
      {/* Botón Añadir Producto */}
      <div className="flex mb-4 gap-4">
        <Button variant="default" onClick={openAddProductModal}>
          Añadir producto
        </Button>
        <Button
          variant={deleteMode ? "destructive" : "secondary"}
          onClick={() => setDeleteMode(!deleteMode)}
        >
          {deleteMode ? "Cancelar eliminar" : "Eliminar producto"}
        </Button>
      </div>

      {/* Tabla de stock */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Línea</TableHead>
            <TableHead>Selección</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Ajustar Stock</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead className="text-center">Capacidad</TableHead>
            <TableHead className="text-center">Mínimo</TableHead>
            <TableHead className="text-right">Precio (€)</TableHead>
            {deleteMode && <TableHead>Eliminar</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((item) => {
            const belowMin = item.currentStock < item.minThreshold;
            return (
              <TableRow key={item.id}>
                <TableCell>{item.line}</TableCell>
                <TableCell>{item.selection}</TableCell>
                <TableCell className="font-medium">
                  {item.product.name}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() =>
                      openAdjustStockModal(item.id, item.product.name)
                    }
                  >
                    Ajustar Stock
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={belowMin ? "destructive" : "default"}>
                    {item.currentStock}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {item.maxCapacity}
                </TableCell>
                <TableCell className="text-center">
                  {item.minThreshold}
                </TableCell>
                <TableCell className="text-right">
                  {item.product.price.toFixed(2)}€
                </TableCell>
                {deleteMode && (
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveProduct(item.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {adjustStockModalOpen && selectedProductId && (
        <AdjustStockModal
          open={adjustStockModalOpen}
          onClose={() => setAdjustStockModalOpen(false)}
          onSuccess={refreshProducts}
          machineId={machine.id}
          machineProductId={selectedProductId}
          productName={selectedProductName}
        />
      )}

      {/* Modal Añadir Producto */}
      {isAddProductModalOpen && (
        <AddProductModal
          machine={machine}
          open={isAddProductModalOpen}
          onClose={closeAddProductModal}
          onSuccess={() => {
            closeAddProductModal();
            refreshProducts(); // <-- Refetch automático aquí
          }}
        />
      )}
    </div>
  );
}
