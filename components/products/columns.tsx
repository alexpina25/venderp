"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product, ProductCategory } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { EditProductModal } from "./EditProductModal";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "category",
    header: "Categoría",
    cell: ({ row }) => {
      const value: ProductCategory = row.getValue("category");
      const map = {
        SNACK: "Snack",
        DRINK: "Bebida",
        COMBO: "Combo",
        OTHER: "Otro",
      };
      return <Badge variant="outline">{map[value]}</Badge>;
    },
  },
  {
    accessorKey: "price",
    header: "Precio (€)",
    cell: ({ row }) => <span>{Number(row.getValue("price")).toFixed(2)}</span>,
  },
  {
    accessorKey: "cost",
    header: "Costo (€)",
    cell: ({ row }) =>
      row.getValue("cost") !== null ? (
        <span>{Number(row.getValue("cost")).toFixed(2)}</span>
      ) : (
        <span className="text-muted-foreground italic">–</span>
      ),
  },
  {
  id: "margin",
  header: "Margen (€)",
  cell: ({ row }) => {
    const price = row.original.price;
    const cost = row.original.cost;

    if (cost === null) {
      return <span className="text-muted-foreground italic">–</span>;
    }

    const margin = price - cost;
    let colorClass = "";

    if (margin > 0) {
      colorClass = "text-green-600 font-medium";
    } else if (margin < 0) {
      colorClass = "text-red-600 font-medium";
    }

    return (
      <span className={colorClass}>
        {margin.toFixed(2)}
      </span>
    );
  },
},
  {
    accessorKey: "unit",
    header: "Unidad",
  },
  {
    accessorKey: "active",
    header: "Estado",
    cell: ({ row }) => {
      const active = row.getValue("active") as boolean;
      return (
        <Badge variant={active ? "default" : "destructive"}>
          {active ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
  {
    id: "acciones",
    header: "",
    cell: ({ row }) => {
      const product = row.original;
      return <EditProductModal product={product} />;
    },
  },
];
