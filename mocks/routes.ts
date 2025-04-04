import { Route } from "@/types/route";

export const mockRoutes: Route[] = [
  {
    id: "r1",
    date: new Date("2025-04-03T08:00:00Z"),
    operator: "Pedro Martínez",
    notes: "Ruta matutina por el centro",
    machines: [
      {
        machineId: "1",
        machineCode: "VND-001",
        location: "Oficina Central",
        productsToRefill: [
          { productId: "p1", productName: "Coca-Cola 500ml", quantity: 10 },
        ],
      },
    ],
  },
];
