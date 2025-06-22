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

interface Props {
  posId: string;
}

type MachineProduct = {
  id: string;
  line: string;
  selection: string;
  product: {
    name: string;
    price: number;
  };
};

export function StopProductsList({ posId }: Props) {
  const [products, setProducts] = useState<MachineProduct[] | null>(null);

  useEffect(() => {
    fetch(`/api/pos/${posId}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.machine?.products ?? []))
      .catch(console.error);
  }, [posId]);

  if (!products) {
    return (
      <p className="text-sm text-muted-foreground">Cargando productos...</p>
    );
  }

  if (products.length === 0) {
    return <p className="text-sm text-muted-foreground">Sin productos</p>;
  }

  return (
    <Table className="bg-background rounded-md border">
      <TableHeader>
        <TableRow>
          <TableHead>Línea</TableHead>
          <TableHead>Selección</TableHead>
          <TableHead>Producto</TableHead>
          <TableHead className="text-right">Precio (€)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((p) => (
          <TableRow key={p.id}>
            <TableCell>{p.line}</TableCell>
            <TableCell>{p.selection}</TableCell>
            <TableCell>{p.product.name}</TableCell>
            <TableCell className="text-right">
              {p.product.price.toFixed(2)}€
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
