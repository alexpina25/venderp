"use client";

import { MachineProduct, Product } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Props {
  stock: (MachineProduct & { product: Product })[];
}

export function MachineStockTable({ stock }: Props) {
  return (
    <div className="rounded-md border overflow-x-auto bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead className="text-center">Capacidad</TableHead>
            <TableHead className="text-center">Mínimo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stock.map((item) => {
            const belowMin = item.currentStock < item.minThreshold;
            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.product.name}
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
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
