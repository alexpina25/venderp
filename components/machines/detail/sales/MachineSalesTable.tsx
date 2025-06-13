"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

interface Sale {
  id: string;
  date: string;
  product: string;
  paymentMethod: string;
  price: number;
}

interface Props {
  posId: string;
}

export function MachineSalesTable({ posId }: Props) {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    async function fetchSales() {
      const res = await fetch(`/api/sales?posId=${posId}`);
      if (res.ok) {
        const data = await res.json();
        setSales(data);
      }
    }

    fetchSales();
  }, [posId]);

  return (
    <div className="rounded-md border overflow-x-auto bg-background p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha/Hora</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Método de pago</TableHead>
            <TableHead className="text-right">Importe (€)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>
                {new Date(sale.date).toLocaleString("es-ES")}
              </TableCell>
              <TableCell>{sale.product}</TableCell>
              <TableCell>{sale.paymentMethod}</TableCell>
              <TableCell className="text-right">
                {sale.price}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
