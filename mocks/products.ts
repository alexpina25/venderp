import { Product } from "@/types/product";

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Coca-Cola 500ml",
    category: "DRINK",
    price: 1.5,
    unit: "botella",
    stockMin: 10,
    image: "/images/products/coca-cola.png",
    createdAt: new Date("2025-03-01T10:00:00Z"),
  },
  // ...
];
