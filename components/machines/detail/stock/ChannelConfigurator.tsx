import { useState } from "react";
import { MachineProduct, Product } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MachineWithProducts } from "../MachineDetailsTabs";

interface Props {
  machine: MachineWithProducts;
}

export function ChannelConfigurator({ machine }: Props) {
  const [rows, setRows] = useState<number>(3);
  const [cols, setCols] = useState<number>(3);

  // Crear matriz vacía
  const grid: (MachineProduct & { product: Product })[][] = Array.from(
    { length: rows },
    () => Array(cols).fill(null)
  );

  // Colocar productos en la matriz según línea y selección
  machine.products.forEach((mp) => {
    const r = parseInt(mp.line) - 1;
    const c = parseInt(mp.selection) - 1;
    if (!isNaN(r) && !isNaN(c) && r >= 0 && c >= 0 && r < rows && c < cols) {
      grid[r][c] = mp as any;
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div>
          <Label htmlFor="rows">Filas</Label>
          <Input
            id="rows"
            type="number"
            min={1}
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="w-20"
          />
        </div>
        <div>
          <Label htmlFor="cols">Columnas</Label>
          <Input
            id="cols"
            type="number"
            min={1}
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            className="w-20"
          />
        </div>
      </div>
      <div className="overflow-auto">
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(120px,1fr))` }}
        >
          {grid.map((row, rIdx) =>
            row.map((cell, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                className="border rounded p-2 text-xs space-y-1"
              >
                {cell ? (
                  <>
                    <div className="font-medium text-sm">
                      {cell.product.name}
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>L{cell.line}</span>
                      <span>S{cell.selection}</span>
                    </div>
                    <div className="text-right font-semibold">
                      {cell.price.toFixed(2)}€
                    </div>
                  </>
                ) : (
                  <div className="text-muted-foreground text-center py-6">
                    Vacío
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
