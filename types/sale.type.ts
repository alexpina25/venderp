import { Sale, Product, PDV } from "@prisma/client";

export type SaleWithDetails = Sale & {
  pos: PDV;
  product: Product;
};
