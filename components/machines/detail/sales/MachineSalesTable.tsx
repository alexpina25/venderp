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
import { Coins, CreditCard, SmartphoneNfc } from "lucide-react";

interface Sale {
  id: string;
  date: string;
  product: string;
  paymentMethod: string;
  price: number;
  inserted: number;
  change: number;
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

    const renderMethodIcon = (method: Sale["paymentMethod"]) => {
    switch (method) {
      case "CARD":
        return (
          <span className="flex items-center gap-1">
            <CreditCard className="w-4 h-4" /> Tarjeta
          </span>
        );
      case "COIN":
      case "BILL":
        return (
          <span className="flex items-center gap-1">
            <Coins className="w-4 h-4" /> Efectivo
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1">
            <SmartphoneNfc className="w-4 h-4" /> Llave/NFC
          </span>
        );
    }
  };

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
              <TableCell>{renderMethodIcon(sale.paymentMethod)}</TableCell>
              <TableCell className="text-right">
                {sale.price.toFixed(2)} €
                {(sale.paymentMethod === "COIN" || sale.paymentMethod === "BILL") && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Insertado: {(sale.inserted ?? 0).toFixed(2)}  €<br />
                    Cambio: {(sale.change ?? 0).toFixed(2)} €
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
